import amqp from "amqplib";

async function exchangeBinding() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
    vhost: "binding-example",
  });

  const channel = await connection.createChannel();

  // Criar exchange
  await channel.assertExchange("notify_headers", "headers");
  await channel.assertQueue("email_notification");
  await channel.assertQueue("sms_notification");
  await channel.assertQueue("push_notification");

  // Binds
  await channel.bindQueue("email_notification", "notify_headers", "", {
    // Any = se tiver uma ou outra propriedade
    "x-match": "any",
    // All = as duas propriedades tem que bater
    // 'x-match': 'all',
    notification_type: "email",
    mode: "internal",
  });

  await channel.bindQueue("sms_notification", "notify_headers", "", {
    notification_type: "sms",
  });

  await channel.bindQueue("push_notification", "notify_headers", "", {
    notification_type: "push",
  });

  // Exchange fanout - para mandar mensagem para todas as nossas filas
  await channel.assertExchange("notify_fanout", "fanout");
  await channel.bindQueue("email_notification", "notify_fanout");
  await channel.bindQueue("sms_notification", "notify_fanout");
  await channel.bindQueue("push_notification", "notify_fanout");
  await channel.bindExchange("notify_fanout", "notify_headers", "", {
    notification_type: "all",
  });

  // Publicando mensagem
  channel.publish("notify_headers", "", Buffer.from("meu header"), {
    headers: {
      notification_type: "all",
    },
  });

  await channel.close();
  await connection.close();
}

exchangeBinding();
