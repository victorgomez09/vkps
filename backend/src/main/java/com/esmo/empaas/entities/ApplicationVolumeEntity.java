package com.esmo.empaas.entities;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "application_volumes")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ApplicationVolumeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "path")
    private String path;

    @Column(name = "size")
    private int size;

    @Column(name = "access_mode")
    private String accessMode;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private ApplicationEntity application;

    @CreationTimestamp
    @Column(name = "creation_date")
    private Date creationDate;

    @UpdateTimestamp
    @Column(name = "modification_date")
    private Date modificationdate;
}
