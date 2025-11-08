import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      playground: true,
      uploads: false,
      driver: ApolloDriver,
      autoSchemaFile: true,
      formatError: (error: T) => {
        console.log('error:, ', error);
        const graphQLFormattedError = {
          code: error?.extensions.code,
          message:
            error?.extensions?.exception?.response?.message ||
            error?.extensions?.exception?.message ||
            error?.extensions?.response?.message ||
            error?.message,
        };
        console.log('GRAPHQL GLOBAL ERROR', graphQLFormattedError);
        return graphQLFormattedError;
      },
    }),
    ComponentsModule,
    DatabaseModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
