import amqp from "amqplib";

async function autoDelete() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();
  // auto-delete queues will delete the queue after the last consumer
  // was disconnected even if the consumer do not proccess the message

  await channel.assertQueue("auto_delete", {
    autoDelete: true,
  });

  channel.prefetch(3);
  channel.consume("autoDelete", (data) => {
    console.log(data.content.toString());
    setTimeout(() => {
      channel.ack(data);
    }, 1000);
  });

  channel.publish("", "auto_delete", Buffer.from(`Mensagem fila auto-delete`));

  channel.consume("auto_delete", (data) => {
    console.log(data.content.toString());
  });

  await channel.close();
  await connection.close();
}

autoDelete();
