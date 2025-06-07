// api/send-email.js
export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, bookingData } = req.body;

    // 验证必需的字段
    if (!to || !subject || !bookingData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 构建邮件内容
    const emailHtml = generateEmailTemplate(bookingData);

    // 调用 Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Property Inspection <noreply@yourdomain.com>', // 替换为你的域名
        to: [to],
        subject: subject,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('邮件发送成功:', data);
      res.status(200).json({ success: true, messageId: data.id });
    } else {
      console.error('邮件发送失败:', data);
      res.status(400).json({ error: 'Failed to send email', details: data });
    }
  } catch (error) {
    console.error('邮件服务器错误:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 生成邮件模板
function generateEmailTemplate(bookingData) {
  const { type, booking, isModification } = bookingData;

  let title, message, buttonColor;
  
  if (type === 'confirmation') {
    title = isModification ? 'Booking Time Modified | 预约时间已修改' : 'Booking Confirmed | 预约已确认';
    message = isModification ? 
      'Your booking time has been updated. | 您的预约时间已更新。' : 
      'Your booking has been confirmed. | 您的预约已确认。';
    buttonColor = isModification ? '#f59e0b' : '#10b981';
  } else if (type === 'cancellation') {
    title = 'Booking Cancelled | 预约已取消';
    message = 'Your booking has been cancelled. | 您的预约已取消。';
    buttonColor = '#ef4444';
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .booking-details { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .detail-label { font-weight: bold; color: #374151; }
        .detail-value { color: #6b7280; margin-left: 10px; }
        .button { display: inline-block; background-color: ${buttonColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
        .chinese { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 Property Inspection Service</h1>
          <h1>房产检查服务</h1>
        </div>
        
        <div class="content">
          <h2>${title}</h2>
          
          <p>Dear ${booking.customerName},</p>
          <p>${message}</p>
          
          <div class="booking-details">
            <h3>Booking Details | 预约详情</h3>
            <div class="detail-row">
              <span class="detail-label">Order Number | 订单号:</span>
              <span class="detail-value">${booking.orderNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service Type | 服务类型:</span>
              <span class="detail-value">${booking.serviceType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date & Time | 日期时间:</span>
              <span class="detail-value">${booking.preferredDate} ${booking.preferredTimeSlot}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address | 地址:</span>
              <span class="detail-value">${booking.address}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Key Arrangement | 钥匙安排:</span>
              <span class="detail-value">${booking.keyArrangement}</span>
            </div>
            ${booking.notes ? `
            <div class="detail-row">
              <span class="detail-label">Notes | 备注:</span>
              <span class="detail-value">${booking.notes}</span>
            </div>
            ` : ''}
          </div>
          
          ${type !== 'cancellation' ? `
          <p>If you have any questions, please don't hesitate to contact us.</p>
          ` : ''}
          
          <div class="chinese">
            <p>亲爱的 ${booking.customerName}，</p>
            <p>${message.split(' | ')[1]}</p>
            <p>如有任何疑问，请随时联系我们。</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Best regards | 此致敬礼<br>
          Property Inspection Team | 房产检查团队</p>
          <p>This is an automated message | 这是一封自动发送的邮件</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
