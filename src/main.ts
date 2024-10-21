import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as cors from 'cors'; // Adicione esta importação

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sport Map')
    .setDescription('Projeto de Software do curso')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  process.env.TZ = '-03:00';

  app.useGlobalPipes(new ValidationPipe());
  
  // Habilita CORS
  app.use(cors({
    origin: 'http://localhost:5173', // O domínio do seu frontend
    credentials: true, // Permite cookies, se necessário
  }));

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
