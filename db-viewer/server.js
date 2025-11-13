const express = require("express");
const { Client } = require("pg");

const app = express();
const PORT = 5000;

// Database configuration
const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: "real_estate_db",
  password: "password",
  port: 5432,
};

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PostgreSQL Database Viewer</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        h1 { color: #333; }
        .nav { margin: 20px 0; }
        .nav a { 
          display: inline-block; 
          padding: 10px 20px; 
          margin: 5px; 
          background: #007bff; 
          color: white; 
          text-decoration: none; 
          border-radius: 5px; 
        }
        .nav a:hover { background: #0056b3; }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          background: white; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin: 20px 0;
        }
        th, td { 
          padding: 12px; 
          text-align: left; 
          border-bottom: 1px solid #ddd; 
        }
        th { 
          background: #007bff; 
          color: white; 
          font-weight: bold;
        }
        tr:hover { background: #f8f9fa; }
        .container { max-width: 1400px; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🗄️ Real Estate Database Viewer</h1>
        <div class="nav">
          <a href="/properties">Properties</a>
          <a href="/managers">Managers</a>
          <a href="/tenants">Tenants</a>
          <a href="/applications">Applications</a>
          <a href="/leases">Leases</a>
          <a href="/tables">All Tables</a>
        </div>
        <p>Click on a link above to view data from the database.</p>
      </div>
    </body>
    </html>
  `);
});

app.get("/tables", async (req, res) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Database Tables</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          h1 { color: #333; }
          .back { margin: 20px 0; }
          .back a { color: #007bff; text-decoration: none; }
          table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #007bff; color: white; }
          tr:hover { background: #f8f9fa; }
          .container { max-width: 1400px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="back"><a href="/">← Back to Home</a></div>
          <h1>Database Tables</h1>
          <table>
            <tr><th>Table Name</th></tr>
    `;

    result.rows.forEach((row) => {
      html += `<tr><td>${row.table_name}</td></tr>`;
    });

    html += "</table></div></body></html>";
    res.send(html);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  } finally {
    await client.end();
  }
});

app.get("/properties", async (req, res) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query(`
      SELECT p.id, p.name, p."pricePerMonth", p.beds, p.baths, p."squareFeet", 
             l.address, l.city, l.state, l.country,
             m.name as manager_name, m.email as manager_email
      FROM "Property" p
      LEFT JOIN "Location" l ON p."locationId" = l.id
      LEFT JOIN "Manager" m ON p."managerCognitoId" = m."cognitoId"
      ORDER BY p.id DESC;
    `);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Properties</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          h1 { color: #333; }
          .back { margin: 20px 0; }
          .back a { color: #007bff; text-decoration: none; }
          table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 14px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #007bff; color: white; position: sticky; top: 0; }
          tr:hover { background: #f8f9fa; }
          .container { max-width: 1400px; margin: 0 auto; }
          .count { color: #666; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="back"><a href="/">← Back to Home</a></div>
          <h1>Properties (${result.rows.length} total)</h1>
          <table>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price/Month</th>
              <th>Beds</th>
              <th>Baths</th>
              <th>Sq Ft</th>
              <th>Address</th>
              <th>City</th>
              <th>Country</th>
              <th>Manager</th>
            </tr>
    `;

    result.rows.forEach((row) => {
      html += `
        <tr>
          <td>${row.id}</td>
          <td>${row.name}</td>
          <td>$${row.pricePerMonth}</td>
          <td>${row.beds}</td>
          <td>${row.baths}</td>
          <td>${row.squareFeet}</td>
          <td>${row.address || "N/A"}</td>
          <td>${row.city || "N/A"}</td>
          <td>${row.country || "N/A"}</td>
          <td>${row.manager_name || "N/A"}</td>
        </tr>
      `;
    });

    html += "</table></div></body></html>";
    res.send(html);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  } finally {
    await client.end();
  }
});

app.get("/managers", async (req, res) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM "Manager" ORDER BY id;');

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Managers</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          h1 { color: #333; }
          .back { margin: 20px 0; }
          .back a { color: #007bff; text-decoration: none; }
          table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #28a745; color: white; }
          tr:hover { background: #f8f9fa; }
          .container { max-width: 1400px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="back"><a href="/">← Back to Home</a></div>
          <h1>Managers (${result.rows.length} total)</h1>
          <table>
            <tr><th>ID</th><th>Cognito ID</th><th>Name</th><th>Email</th><th>Phone</th></tr>
    `;

    result.rows.forEach((row) => {
      html += `
        <tr>
          <td>${row.id}</td>
          <td>${row.cognitoId}</td>
          <td>${row.name}</td>
          <td>${row.email}</td>
          <td>${row.phoneNumber}</td>
        </tr>
      `;
    });

    html += "</table></div></body></html>";
    res.send(html);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  } finally {
    await client.end();
  }
});

app.get("/tenants", async (req, res) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM "Tenant" ORDER BY id;');

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tenants</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          h1 { color: #333; }
          .back { margin: 20px 0; }
          .back a { color: #007bff; text-decoration: none; }
          table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #17a2b8; color: white; }
          tr:hover { background: #f8f9fa; }
          .container { max-width: 1400px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="back"><a href="/">← Back to Home</a></div>
          <h1>Tenants (${result.rows.length} total)</h1>
          <table>
            <tr><th>ID</th><th>Cognito ID</th><th>Name</th><th>Email</th><th>Phone</th></tr>
    `;

    result.rows.forEach((row) => {
      html += `
        <tr>
          <td>${row.id}</td>
          <td>${row.cognitoId}</td>
          <td>${row.name}</td>
          <td>${row.email}</td>
          <td>${row.phoneNumber}</td>
        </tr>
      `;
    });

    html += "</table></div></body></html>";
    res.send(html);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  } finally {
    await client.end();
  }
});

app.get("/applications", async (req, res) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query(`
      SELECT a.id, a.name, a.email, a.phoneNumber, a.status, a."applicationDate",
             p.name as property_name, t.name as tenant_name
      FROM "Application" a
      LEFT JOIN "Property" p ON a."propertyId" = p.id
      LEFT JOIN "Tenant" t ON a."tenantCognitoId" = t."cognitoId"
      ORDER BY a.id DESC;
    `);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Applications</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          h1 { color: #333; }
          .back { margin: 20px 0; }
          .back a { color: #007bff; text-decoration: none; }
          table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #ffc107; color: #333; }
          tr:hover { background: #f8f9fa; }
          .container { max-width: 1400px; margin: 0 auto; }
          .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .status-Pending { background: #fff3cd; color: #856404; }
          .status-Approved { background: #d4edda; color: #155724; }
          .status-Denied { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="back"><a href="/">← Back to Home</a></div>
          <h1>Applications (${result.rows.length} total)</h1>
          <table>
            <tr>
              <th>ID</th>
              <th>Applicant</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Property</th>
              <th>Tenant</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
    `;

    result.rows.forEach((row) => {
      const date = new Date(row.applicationDate).toLocaleDateString();
      html += `
        <tr>
          <td>${row.id}</td>
          <td>${row.name}</td>
          <td>${row.email}</td>
          <td>${row.phoneNumber}</td>
          <td>${row.property_name || "N/A"}</td>
          <td>${row.tenant_name || "N/A"}</td>
          <td><span class="status status-${row.status}">${
        row.status
      }</span></td>
          <td>${date}</td>
        </tr>
      `;
    });

    html += "</table></div></body></html>";
    res.send(html);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  } finally {
    await client.end();
  }
});

app.get("/leases", async (req, res) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query(`
      SELECT l.id, l."startDate", l."endDate", l.rent, l.deposit,
             p.name as property_name, t.name as tenant_name
      FROM "Lease" l
      LEFT JOIN "Property" p ON l."propertyId" = p.id
      LEFT JOIN "Tenant" t ON l."tenantCognitoId" = t."cognitoId"
      ORDER BY l.id DESC;
    `);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Leases</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          h1 { color: #333; }
          .back { margin: 20px 0; }
          .back a { color: #007bff; text-decoration: none; }
          table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #6f42c1; color: white; }
          tr:hover { background: #f8f9fa; }
          .container { max-width: 1400px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="back"><a href="/">← Back to Home</a></div>
          <h1>Leases (${result.rows.length} total)</h1>
          <table>
            <tr>
              <th>ID</th>
              <th>Property</th>
              <th>Tenant</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Rent</th>
              <th>Deposit</th>
            </tr>
    `;

    result.rows.forEach((row) => {
      const startDate = new Date(row.startDate).toLocaleDateString();
      const endDate = new Date(row.endDate).toLocaleDateString();
      html += `
        <tr>
          <td>${row.id}</td>
          <td>${row.property_name || "N/A"}</td>
          <td>${row.tenant_name || "N/A"}</td>
          <td>${startDate}</td>
          <td>${endDate}</td>
          <td>$${row.rent}</td>
          <td>$${row.deposit}</td>
        </tr>
      `;
    });

    html += "</table></div></body></html>";
    res.send(html);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  } finally {
    await client.end();
  }
});

app.listen(PORT, () => {
  console.log(`\n🗄️  Database Viewer running at: http://localhost:${PORT}`);
  console.log(`📊 Open your browser and visit the URL above\n`);
});
