import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();

  await channel.assertQueue("minha_fila", {
    durable: true,
  });

  channel.prefetch(100);

  channel.consume("minha_fila", (data) => {
    console.log(data.content.toString());
    channel.ack(data);
  });
}

main();
