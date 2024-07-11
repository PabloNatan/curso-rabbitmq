import amqp from "amqplib";

async function exchange() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();

  await channel.assertExchange("udemy_exchange", "direct");

  await channel.assertQueue("udemy_notification", {
    durable: true,
  });

  await channel.assertQueue("udemy_push_notification", {
    durable: true,
  });

  await channel.assertQueue("udemy_email_notification", {
    durable: true,
  });

  await channel.bindQueue(
    "udemy_push_notification",
    "udemy_exchange",
    "novoCurso"
  );

  await channel.bindQueue(
    "udemy_email_notification",
    "udemy_exchange",
    "novoCurso"
  );

  channel.publish("udemy_exchange", "novoCurso", Buffer.from("Teste mensagem"));

  await channel.close();
  await connection.close();
}

exchange();
