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

  channel.publish("", "minha_fila", Buffer.from("Minha mensagem"));

  await channel.close();
  await connection.close();
}

main();
