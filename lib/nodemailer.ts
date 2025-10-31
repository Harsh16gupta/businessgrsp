import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBusinessRequirementEmail = async (formData: any) => {
  console.log('📧 Sending email with data:', formData); // Debug log

  // ✅ ADD VALIDATION to ensure all required fields exist
  if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
    console.error('❌ Missing required fields in email data:', formData);
    throw new Error('Missing required fields for email');
  }

  const selectedService = formData.serviceType || 'Not specified';
  const workersNeeded = formData.workersNeeded || 'Not specified';
  const duration = formData.duration || 'Not specified';
  const location = formData.location || 'Not specified';
  const additionalNotes = formData.additionalNotes || 'None';
  const bookingId = formData.bookingId || 'N/A';
  const proposedBudget = formData.proposedBudget || 'Not specified';

  // ✅ COMPLETE EMAIL TEMPLATE WITH ALL FIELDS
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0;
          padding: 0;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background: #f9f9f9;
        }
        .header { 
          background: #2563eb; 
          color: white; 
          padding: 20px; 
          text-align: center; 
          border-radius: 8px 8px 0 0; 
        }
        .content { 
          background: white; 
          padding: 20px; 
          border-radius: 0 0 8px 8px;
          border: 1px solid #e1e5e9;
        }
        .field { 
          margin-bottom: 15px; 
          padding: 10px;
          border-bottom: 1px solid #f0f0f0;
        }
        .label { 
          font-weight: bold; 
          color: #1e293b; 
          margin-bottom: 5px;
        }
        .value { 
          color: #475569; 
        }
        .notes { 
          background: #f8fafc; 
          padding: 15px; 
          border-radius: 6px; 
          border-left: 4px solid #2563eb; 
        }
        .budget-highlight {
          background: #fff7ed;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #f59e0b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Business Staff Requirement</h1>
          <p>Submitted on ${new Date().toLocaleString('en-IN')}</p>
        </div>
        <div class="content">
          <!-- Company Information -->
          <div class="field">
            <div class="label">Company Information</div>
            <div class="value">
              <strong>Company Name:</strong> ${formData.companyName}<br>
              <strong>Contact Person:</strong> ${formData.contactPerson}<br>
              <strong>Email:</strong> ${formData.email}<br>
              <strong>Phone:</strong> ${formData.phone}
            </div>
          </div>
          
          <!-- Staff Requirement Details -->
          <div class="field">
            <div class="label">Staff Requirement Details</div>
            <div class="value">
              <strong>Service Type:</strong> ${selectedService}<br>
              <strong>Workers Needed:</strong> ${workersNeeded}<br>
              <strong>Duration:</strong> ${duration}<br>
              <strong>Location:</strong> ${location}
            </div>
          </div>

          <!-- Proposed Budget -->
          <div class="field">
            <div class="label">Proposed Budget</div>
            <div class="value budget-highlight">
              <strong>${proposedBudget}</strong>
            </div>
          </div>

          <!-- Booking Reference -->
          <div class="field">
            <div class="label">Booking Reference</div>
            <div class="value">
              <strong>ID:</strong> ${bookingId}
            </div>
          </div>
          
          <!-- Additional Notes -->
          ${additionalNotes && additionalNotes !== 'None' ? `
          <div class="field">
            <div class="label">Additional Notes</div>
            <div class="value notes">${additionalNotes}</div>
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
NEW BUSINESS STAFF REQUIREMENT
=================================

COMPANY INFORMATION:
-------------------
Company: ${formData.companyName}
Contact: ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}

STAFF REQUIREMENT:
------------------
Type: ${selectedService}
Workers Needed: ${workersNeeded}
Duration: ${duration}
Location: ${location}

PROPOSED BUDGET:
----------------
${proposedBudget}

BOOKING REFERENCE:
------------------
ID: ${bookingId}

ADDITIONAL NOTES:
-----------------
${additionalNotes}

Submitted: ${new Date().toLocaleString('en-IN')}
=================================
  `.trim();

  try {
    const result = await transporter.sendMail({
      from: `"GRS WORKER BUSINESS" <${process.env.SMTP_USER}>`,
      to: 'satyam.grss10@gmail.com', // Your admin email
      subject: `New Staff Requirement - ${formData.companyName}`,
      text: textContent,
      html: htmlContent,
    });

    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error };
  }
};