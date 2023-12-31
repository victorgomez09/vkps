import { Migration } from '@mikro-orm/migrations';

export class Migration20231230220427 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `deployments` (`id` text not null, `deployment_id` text not null, `name` text not null, `description` text not null, `image` text not null, `replicas` integer not null, `memory` text not null, `cpu` text not null, `exposed_network` integer not null, `port` integer not null, `creation_date` datetime not null, `update_time` datetime not null, primary key (`id`));');

    this.addSql('create table `deployment_env` (`id` text not null, `key` text not null, `value` text not null, `description` text not null, `deployment_id` text not null, `creation_date` datetime not null, `update_time` datetime not null, constraint `deployment_env_deployment_id_foreign` foreign key(`deployment_id`) references `deployments`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `deployment_env_deployment_id_index` on `deployment_env` (`deployment_id`);');

    this.addSql('create table `deployment_volume` (`id` text not null, `path` text not null, `size` text not null, `access_mode` text not null, `deployment_id` text not null, `creation_date` datetime not null, `update_time` datetime not null, constraint `deployment_volume_deployment_id_foreign` foreign key(`deployment_id`) references `deployments`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `deployment_volume_deployment_id_index` on `deployment_volume` (`deployment_id`);');

    this.addSql('create table `users` (`id` text not null, `email` text not null, `password` text not null, `name` text not null, primary key (`id`));');
    this.addSql('create unique index `users_email_unique` on `users` (`email`);');
  }

}
