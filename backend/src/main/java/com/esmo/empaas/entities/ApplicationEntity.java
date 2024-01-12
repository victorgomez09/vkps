package com.esmo.empaas.entities;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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

    @CreationTimestamp
    @Column(name = "creation_date")
    private Date creationDate;

    @UpdateTimestamp
    @Column(name = "modification_date")
    private Date modificationdate;
}
