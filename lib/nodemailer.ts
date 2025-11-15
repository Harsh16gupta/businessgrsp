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
  const numberOfDays = formData.numberOfDays || 'Not specified';
  const totalCost = formData.totalCost || null;

  // ✅ COMPLETE EMAIL TEMPLATE WITH ALL FIELDS INCLUDING PAYMENT BREAKDOWN
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
        .payment-breakdown {
          background: #f0fdf4;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #10b981;
        }
        .total-cost {
          background: #dcfce7;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
          border: 2px solid #10b981;
        }
        .calculation {
          font-size: 0.9em;
          color: #059669;
          margin-top: 5px;
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
              <strong>Duration per Day:</strong> ${duration}<br>
              <strong>Number of Days:</strong> ${numberOfDays}<br>
              <strong>Location:</strong> ${location}
            </div>
          </div>

          <!-- Payment Breakdown -->
          <div class="field">
            <div class="label">Payment Details</div>
            <div class="payment-breakdown">
              <strong>Proposed Budget per Worker per Day:</strong> ₹${proposedBudget}<br>
              <strong>Total Workers:</strong> ${workersNeeded}<br>
              <strong>Total Days:</strong> ${numberOfDays}<br>
              ${totalCost ? `
              <div class="total-cost">
                <strong>Estimated Total Project Cost: ₹${parseInt(totalCost).toLocaleString('en-IN')}</strong>
                <div class="calculation">
                  Calculation: ${workersNeeded} workers × ${numberOfDays} days × ₹${proposedBudget}/day
                </div>
              </div>
              ` : ''}
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

          <!-- Action Required -->
          <div class="field">
            <div class="label">Action Required</div>
            <div class="value">
              <p style="color: #dc2626; font-weight: bold;">
                ⚡ Please log in to the admin panel to assign workers and set final payment amounts.
              </p>
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Review the proposed budget</li>
                <li>Assign suitable workers</li>
                <li>Set final payment amounts for workers</li>
                <li>Send notifications to assigned workers</li>
              </ul>
            </div>
          </div>
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
Duration per Day: ${duration}
Number of Days: ${numberOfDays}
Location: ${location}

PAYMENT DETAILS:
----------------
Proposed Budget per Worker per Day: ₹${proposedBudget}
Total Workers: ${workersNeeded}
Total Days: ${numberOfDays}
${totalCost ? `
ESTIMATED TOTAL PROJECT COST: ₹${parseInt(totalCost).toLocaleString('en-IN')}
Calculation: ${workersNeeded} workers × ${numberOfDays} days × ₹${proposedBudget}/day
` : ''}

BOOKING REFERENCE:
------------------
ID: ${bookingId}

ADDITIONAL NOTES:
-----------------
${additionalNotes}

ACTION REQUIRED:
----------------
⚡ Please log in to the admin panel to:
   - Review the proposed budget
   - Assign suitable workers
   - Set final payment amounts for workers
   - Send notifications to assigned workers

Submitted: ${new Date().toLocaleString('en-IN')}
=================================
  `.trim();

  try {
    const result = await transporter.sendMail({
      from: `"GRS WORKER BUSINESS" <${process.env.SMTP_USER}>`,
      to: 'satyam.grss10@gmail.com', // Your admin email
      subject: `New Staff Requirement - ${formData.companyName} (${workersNeeded} workers, ${numberOfDays} days)`,
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