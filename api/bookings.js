import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  console.log(`📨 API请求: ${req.method} /api/bookings`);
  
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    console.log('✅ 处理OPTIONS请求');
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      console.log('📂 处理GET请求');
      
      try {
        // 从KV获取数据，设置默认值
        const bookings = await kv.get('bookings') || [];
        const settings = await kv.get('settings') || {
          welcomeMessage: 'Welcome to our property inspection booking system! We provide professional and caring property inspection services.',
          noticeMessage: 'Please note:\n• Please ensure the appointment time is accurate\n• For cancellations or modifications, please contact us 24 hours in advance\n• Please prepare relevant documents on the inspection day\n• If you have special requirements, please specify in the remarks\n\n请注意：\n• 请确保预约时间准确无误\n• 如需取消或修改，请提前24小时联系\n• 检查当天请准备好相关文件\n• 如有特殊要求，请在备注中说明',
          afterSubmitNotice: 'We will confirm your appointment details within 24 hours.\nIf you have any questions, please contact us anytime.\nThank you for your trust!\n\n我们会在24小时内与您确认预约详情。\n如有任何疑问，请随时联系我们。\n谢谢您的信任！'
        };
        const nextOrderNumber = await kv.get('nextOrderNumber') || 1;

        console.log(`✅ 成功获取 ${bookings.length} 个订单`);
        
        return res.status(200).json({
          success: true,
          bookings: bookings,
          settings: settings,
          nextOrderNumber: nextOrderNumber
        });

      } catch (kvError) {
        console.error('❌ KV读取失败:', kvError);
        
        // KV失败时返回默认数据
        return res.status(200).json({
          success: true,
          bookings: [],
          settings: {
            welcomeMessage: 'Welcome to our property inspection booking system!',
            noticeMessage: 'System notice',
            afterSubmitNotice: 'Thank you for your booking!'
          },
          nextOrderNumber: 1,
          debug: 'KV读取失败，返回默认数据'
        });
      }

    } else if (req.method === 'POST') {
      console.log('💾 处理POST请求');
      
      const { bookings, settings, nextOrderNumber } = req.body;
      
      if (!bookings && !settings && !nextOrderNumber) {
        console.log('⚠️ 没有数据需要保存');
        return res.status(400).json({ error: 'No data provided' });
      }

      try {
        // 逐个保存数据
        if (Array.isArray(bookings)) {
          await kv.set('bookings', bookings);
          console.log(`✅ 保存 ${bookings.length} 个订单`);
        }
        
        if (settings && typeof settings === 'object') {
          await kv.set('settings', settings);
          console.log('✅ 保存设置');
        }
        
        if (typeof nextOrderNumber === 'number') {
          await kv.set('nextOrderNumber', nextOrderNumber);
          console.log(`✅ 更新订单号: ${nextOrderNumber}`);
        }

        return res.status(200).json({
          success: true,
          message: 'Data saved successfully'
        });

      } catch (kvError) {
        console.error('❌ KV保存失败:', kvError);
        return res.status(500).json({ 
          error: 'Failed to save data',
          details: kvError.message 
        });
      }

    } else {
      console.log(`❌ 不支持的方法: ${req.method}`);
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('❌ API处理错误:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}