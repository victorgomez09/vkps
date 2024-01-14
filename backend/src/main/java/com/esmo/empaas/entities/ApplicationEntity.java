package com.esmo.empaas.entities;

import java.util.Date;
import java.util.List;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "applications")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "repository_url", nullable = true)
    private String repositoryUrl;

    @Column(name = "dockerImage", nullable = true)
    private String dockerImage;

    @Column(name = "replicas")
    private int replicas;

    @Column(name = "memory")
    private int memory;

    @Column(name = "cpu")
    private int cpu;

    @Column(name = "is_bot")
    private boolean isBot;

    @Column(name = "port", nullable = true)
    private int port;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "application")
    private List<ApplicationVolumeEntity> volumes;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "application")
    private List<ApplicationEnvEntity> envs;

    @ManyToOne
    @JoinColumn(name = "buildpack_id")
    private BuildpackEntity buildpack;

    @Column(name = "buildpack_version")
    private String buildpackVersion;

    @Column(name = "install_command")
    private String installCommand;

    @Column(name = "build_command")
    private String buildCommand;

    @Column(name = "start_command")
    private String startCommand;

    @Column(name = "base_directory")
    private String baseDirectory;

    @CreationTimestamp
    @Column(name = "creation_date")
    private Date creationDate;

    @UpdateTimestamp
    @Column(name = "modification_date")
    private Date modificationDate;
}
