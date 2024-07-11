import amqp from "amqplib";

async function maxLength() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();
  // The max number of queue in the ready state

  await channel.assertQueue("max_length", {
    maxLength: 30000,
  });

  for (let i = 1; i <= 100; i++) {
    channel.publish("", "max_length", Buffer.from(`Minha mensagem ${i}`));
  }

  await channel.close();
  await connection.close();
}

maxLength();
