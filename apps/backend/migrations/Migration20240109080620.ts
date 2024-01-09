import { Migration } from '@mikro-orm/migrations';

export class Migration20240109080620 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `addon_versions` (`id` text not null, `version` text not null, `addon_id` text not null, constraint `addon_versions_addon_id_foreign` foreign key(`addon_id`) references `addons`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create unique index `addon_versions_addon_id_unique` on `addon_versions` (`addon_id`);');

    this.addSql('create table `addons` (`id` text not null, `name` text not null, `description` text not null, `logo` text not null, `versions_id` text not null, `creation_date` datetime not null, `update_time` datetime not null, constraint `addons_versions_id_foreign` foreign key(`versions_id`) references `addon_versions`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create unique index `addons_versions_id_unique` on `addons` (`versions_id`);');

    this.addSql('create table `addon_envs` (`id` text not null, `key` text not null, `value` text not null, `addon_id` text not null, `creation_date` datetime not null, `update_time` datetime not null, constraint `addon_envs_addon_id_foreign` foreign key(`addon_id`) references `addons`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `addon_envs_addon_id_index` on `addon_envs` (`addon_id`);');

    this.addSql('create table `addon_volumes` (`id` text not null, `path` text not null, `size` text not null, `access_mode` text not null, `addon_id` text not null, `creation_date` datetime not null, `update_time` datetime not null, constraint `addon_volumes_addon_id_foreign` foreign key(`addon_id`) references `addons`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `addon_volumes_addon_id_index` on `addon_volumes` (`addon_id`);');

    this.addSql('create table `configuration` (`id` text not null, `docker_registry_port` integer not null, `creation_date` datetime not null, `update_date` datetime not null, primary key (`id`));');

    this.addSql('create table `buildpacks` (`id` text not null, `name` text not null, `creation_date` datetime not null, `modification_date` datetime not null, primary key (`id`));');

    this.addSql('create table `buildpack_versions` (`id` text not null, `version` text not null, `buildpack_id` text not null, `creation_date` datetime not null, `modification_date` datetime not null, constraint `buildpack_versions_buildpack_id_foreign` foreign key(`buildpack_id`) references `buildpacks`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `buildpack_versions_buildpack_id_index` on `buildpack_versions` (`buildpack_id`);');

    this.addSql('create table `deployments` (`id` text not null, `deployment_id` text not null, `name` text not null, `description` text not null, `repository_url` text null, `image` text null, `replicas` integer not null, `memory` text not null, `cpu` text not null, `exposed_network` integer not null, `port` integer not null, `buildpack_id` text not null, `creation_date` datetime not null, `update_time` datetime not null, constraint `deployments_buildpack_id_foreign` foreign key(`buildpack_id`) references `buildpacks`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create unique index `deployments_buildpack_id_unique` on `deployments` (`buildpack_id`);');

    this.addSql('create table `deployment_env` (`id` text not null, `key` text not null, `value` text not null, `description` text not null, `deployment_id` text not null, `creation_date` datetime not null, `update_time` datetime not null, constraint `deployment_env_deployment_id_foreign` foreign key(`deployment_id`) references `deployments`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `deployment_env_deployment_id_index` on `deployment_env` (`deployment_id`);');

    this.addSql('create table `deployment_volume` (`id` text not null, `path` text not null, `size` text not null, `access_mode` text not null, `deployment_id` text not null, `creation_date` datetime not null, `update_time` datetime not null, constraint `deployment_volume_deployment_id_foreign` foreign key(`deployment_id`) references `deployments`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `deployment_volume_deployment_id_index` on `deployment_volume` (`deployment_id`);');

    this.addSql('create table `users` (`id` text not null, `email` text not null, `password` text not null, `name` text not null, primary key (`id`));');
    this.addSql('create unique index `users_email_unique` on `users` (`email`);');
  }

}
