import fs from 'fs';
import puppeteer from 'puppeteer';
import jwt from 'jsonwebtoken';
import { assessmentConfig } from '../config/config.js';
import { extractFieldData } from '../utils/dataExtractor.js';
import { healthDatasets } from '../data/data.js';

export const getDashboard = (req, res) => {
  try {
    const sessions = healthDatasets.map(session => ({
      session_id: session.session_id,
      assessment_id: session.assessment_id,
      accuracy: session.accuracy,
      timestamp: session.timestamp,
      gender: session.gender
    }));
    res.json({ message: 'Dashboard data', sessions });
  } catch (error) {
    res.status(500).json({ message: 'Error getting data', error: error.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { session_id } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!session_id) return res.status(400).json({ message: 'Session ID required' });
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const session = healthDatasets.find(s => s.session_id === session_id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const config = assessmentConfig[session.assessment_id];
    if (!config) return res.status(400).json({ message: 'No config found for this assessment type' });

    const html = generateReportHTML(session, config, decoded.username);

    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });
    
    await browser.close();

    const fileName = `${session.session_id}_${session.assessment_id}_Report.pdf`;
    const pdfPath = `./reports/${fileName}`;
    
    if (!fs.existsSync('./reports')) {
      fs.mkdirSync('./reports', { recursive: true });
    }
    
    fs.writeFileSync(pdfPath, pdfBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

function generateReportHTML(session, config, username) {
  const date = new Date(session.timestamp).toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${config.name}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20px; 
          color: #333;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          background: #2c3e50; 
          color: white; 
          padding: 25px; 
          border-radius: 8px 8px 0 0;
          margin-bottom: 0;
        }
        .header h1 { 
          margin: 0 0 10px 0; 
          font-size: 28px;
        }
        .header p { 
          margin: 5px 0; 
          opacity: 0.9;
        }
        .container { 
          background: white; 
          padding: 25px; 
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .patient-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 25px;
          border-left: 4px solid #2c3e50;
        }
        .section { 
          margin-bottom: 30px; 
          page-break-inside: avoid;
        }
        .section h2 { 
          color: #2c3e50; 
          border-bottom: 2px solid #2c3e50; 
          padding-bottom: 10px; 
          margin-bottom: 15px;
          font-size: 20px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
          font-size: 14px;
        }
        table, th, td { 
          border: 1px solid #ddd; 
        }
        th, td { 
          padding: 12px; 
          text-align: left; 
        }
        th { 
          background: #f2f2f2; 
          font-weight: bold;
        }
        tr:nth-child(even) {
          background: #f9f9f9;
        }
        .status { 
          font-weight: bold; 
          padding: 6px 12px; 
          border-radius: 4px; 
          display: inline-block;
          font-size: 12px;
          text-align: center;
          min-width: 80px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #777;
          font-size: 12px;
        }
        @media print {
          body { 
            padding: 0; 
            background: white;
          }
          .header { 
            border-radius: 0; 
            margin-bottom: 0;
          }
          .container { 
            box-shadow: none; 
            padding: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${config.name}</h1>
        <p>Generated for: ${username}</p>
        <p>Session: ${session.session_id} | Date: ${date}</p>
      </div>
      
      <div class="container">
        <div class="patient-info">
          <strong>Patient Information:</strong> 
          ${session.gender || 'Not specified'} | 
          Height: ${session.height || 'N/A'} cm | 
          Weight: ${session.weight || 'N/A'} kg
        </div>
        
        ${config.sections.map(section => `
          <div class="section">
            <h2>${section.name}</h2>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${section.fields.map(field => {
                  const data = extractFieldData(session, field);
                  return `
                    <tr>
                      <td><strong>${data.label}</strong></td>
                      <td>${data.value} ${data.unit}</td>
                      <td>
                        ${data.classification ? 
                          `<span class="status" style="background:${data.classification.color};color:white;">
                            ${data.classification.label}
                          </span>` : 
                          'N/A'
                        }
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
        
        <div class="footer">
          <p>Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>This report is generated automatically and should be reviewed by a healthcare professional.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}