import amqp from "amqplib";

async function exclusive() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();
  // Exclusive queues can only be used by the channel who created it, and this is
  // a temporary queue

  await channel.assertQueue("exclusive", {
    exclusive: true,
  });

  channel.prefetch(3);
  channel.consume("exclusive", (data) => {
    console.log(data.content.toString());
    setTimeout(() => {
      channel.ack(data);
    }, 1000);
  });

  for (let i = 0; i < 10; i++) {
    channel.publish(
      "",
      "exclusive",
      Buffer.from(`Mensagem exlusiva - ${crypto.randomUUID()}`)
    );
  }

  await channel.close();
  await connection.close();
}

exclusive();
