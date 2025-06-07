// api/bookings.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // 设置CORS头，允许跨域访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      console.log('📂 获取数据...');
      
      // 从Redis获取数据
      const bookings = await kv.get('bookings') || [];
      const settings = await kv.get('settings') || {
        welcomeMessage: 'Welcome to our property inspection booking system! We provide professional and caring property inspection services.',
        noticeMessage: 'Please note:\n• Please ensure the appointment time is accurate\n• For cancellations or modifications, please contact us 24 hours in advance\n• Please prepare relevant documents on the inspection day\n• If you have special requirements, please specify in the remarks\n\n请注意：\n• 请确保预约时间准确无误\n• 如需取消或修改，请提前24小时联系\n• 检查当天请准备好相关文件\n• 如有特殊要求，请在备注中说明',
        afterSubmitNotice: 'We will confirm your appointment details within 24 hours.\nIf you have any questions, please contact us anytime.\nThank you for your trust!\n\n我们会在24小时内与您确认预约详情。\n如有任何疑问，请随时联系我们。\n谢谢您的信任！'
      };
      const nextOrderNumber = await kv.get('nextOrderNumber') || 1;

      console.log(`✅ 成功获取 ${bookings.length} 个订单`);
      
      res.status(200).json({
        success: true,
        bookings: bookings,
        settings: settings,
        nextOrderNumber: nextOrderNumber
      });

    } else if (req.method === 'POST') {
      console.log('💾 保存数据...');
      
      const { bookings, settings, nextOrderNumber } = req.body;

      // 保存到Redis
      if (bookings !== undefined) {
        await kv.set('bookings', bookings);
        console.log(`✅ 保存了 ${bookings.length} 个订单`);
      }
      
      if (settings !== undefined) {
        await kv.set('settings', settings);
        console.log('✅ 保存了系统设置');
      }
      
      if (nextOrderNumber !== undefined) {
        await kv.set('nextOrderNumber', nextOrderNumber);
        console.log(`✅ 更新订单号为 ${nextOrderNumber}`);
      }

      res.status(200).json({
        success: true,
        message: 'Data saved successfully'
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('❌ 数据库操作失败:', error);
    res.status(500).json({ 
      error: 'Database operation failed', 
      details: error.message 
    });
  }
}