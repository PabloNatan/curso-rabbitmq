import amqp from "amqplib";

async function exchange() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
    vhost: "fanout-example",
  });

  const channel = await connection.createChannel();

  // Filas
  // email_notification
  // sms_notification
  // push_notification

  // Quando houver alguma suspeita de login enviar mensagens para todos

  await channel.assertExchange("notifications", "fanout");

  await channel.assertQueue("email_notificaiton");
  await channel.assertQueue("sms_notification");
  await channel.assertQueue("push_notification");

  await channel.bindQueue("email_notificaiton", "notifications", "");
  await channel.bindQueue("sms_notification", "notifications", "");
  await channel.bindQueue("push_notification", "notifications", "");

  channel.publish(
    "notifications",
    "",
    Buffer.from(`Sua conta teve uma atividade suspeita ${crypto.randomUUID()}`)
  );

  await channel.close();
  await connection.close();
}

exchange();
