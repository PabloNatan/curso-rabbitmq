import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();
  await channel.assertQueue("priority", {
    maxPriority: 5,
  });

  for (let i = 0; i < 10; i++) {
    channel.publish(
      "",
      "priority",
      Buffer.from("Mensagem padrão sem prioridade")
    );
  }

  await channel.close();
  await connection.close();
}

main();
