const PDFDocument = require('pdfkit');
const fs = require('fs');
const express = require('express');
const qr = require('qrcode');
const path = require('path');
const router = express.Router();

router.use(express.json());

const createTicket = async (req, res, bagage, idTrajet) => {
  try {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const ticketsDir = path.join(__dirname, '../tickets');
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir, { recursive: true });
    }

    const filename = path.join(ticketsDir, `bagageticket${Math.floor(Math.random() * (99999 - 10000) + 10000)}-${idTrajet}.pdf`);
    const stream = fs.createWriteStream(filename);
    doc.pipe(stream);

    doc.fontSize(20).text('Ticket de Bagage', { align: 'center' });
    doc.fontSize(12).text(`ID Trajet: ${idTrajet}`, { align: 'center' });
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.moveTo(doc.page.width / 2, 110)
      .lineTo(doc.page.width / 2, doc.page.height - 50)
      .dash(5, { space: 5 })
      .stroke();

    for (let i = 0; i < bagage.length; i += 2) {
      if (i !== 0) {
        doc.addPage();
        doc.moveTo(doc.page.width / 2, 50)
          .lineTo(doc.page.width / 2, doc.page.height - 50)
          .dash(5, { space: 5 })
          .stroke();
      }

      const centerXLeft = doc.page.width / 4;
      const centerXRight = (3 * doc.page.width) / 4;
      const centerY = doc.page.height / 2 - 75;
      
      if (bagage[i]) {
        doc.fontSize(14).text(`Bagage ${i + 1}`, centerXRight - 50, centerY - 50, { align: 'left' });
        const qrDataURL1 = await qr.toDataURL(`Bagage ID: ${bagage[i]}`);
        doc.image(qrDataURL1, centerXRight - 100, centerY, { fit: [150, 150] })
          .rect(centerXRight - 110, centerY - 10, 170, 170).stroke();
      }
      
      if (bagage[i + 1]) {
        doc.fontSize(14).text(`Bagage ${i + 2}`, centerXLeft - 50, centerY - 50, { align: 'left' });
        const qrDataURL2 = await qr.toDataURL(`Bagage ID: ${bagage[i + 1]}`);
        doc.image(qrDataURL2, centerXLeft - 100, centerY, { fit: [150, 150] })
          .rect(centerXLeft - 110, centerY - 10, 170, 170).stroke();
      }
    }

   
    
    doc.end();

    stream.on('finish', () => {
      res.status(201).send(JSON.stringify({ message: 'Ticket created successfully', filename }));
    });

    stream.on('error', (err) => {
      console.error('Error creating PDF:', err);
      res.status(500).send(JSON.stringify({ error: 'Failed to create ticket' }));
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    res.status(500).send(JSON.stringify({ error: 'Failed to generate QR code' }));
  }
};

router.post('/createBagage', async (req, res) => {
  console.log('Received body:', req.body);
  const { bagage, idTrajet } = req.body;

  if (!bagage || !idTrajet) {
    return res.status(400).send(JSON.stringify({ error: 'Missing bagage or idTrajet in request body' }));
  }

  await createTicket(req, res, bagage, idTrajet);
});

module.exports = router;