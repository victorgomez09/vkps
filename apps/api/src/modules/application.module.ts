import { Module } from "@nestjs/common";
import { ConfigurationModule } from "src/config/config.module";
import { ApplicationController } from "src/controllers/application.controller";
import { ApplicationService } from "src/services/application.service";

@Module({
    controllers: [ApplicationController],
    providers: [ApplicationService],
    imports: [ConfigurationModule]
})
export class ApplicationModule { }