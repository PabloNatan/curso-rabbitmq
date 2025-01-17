import amqp from "amqplib";

async function exchange() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();

  await channel.assertExchange("system_exchange", "topic");
  await channel.assertQueue("system_logs");
  // logs.(system).info --> logs.*.info
  // logs.(system.info) --> logs.#
  await channel.bindQueue("system_logs", "system_exchange", "logs.#");

  channel.publish(
    "system_exchange",
    "logs.system.info",
    Buffer.from("Sistema iniciado")
  );

  channel.publish(
    "system_exchange",
    "logs.system.erro",
    Buffer.from("Erro no sistema")
  );

  await channel.close();
  await connection.close();
}

exchange();
