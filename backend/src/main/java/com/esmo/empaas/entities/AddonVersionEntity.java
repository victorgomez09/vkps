package com.esmo.empaas.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@Table(name = "addon_versions")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AddonVersionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "version")
    private String version;

    @ManyToOne
    @JoinColumn(name = "addon_id")
    private AddonEntity addon;

    @CreationTimestamp
    @Column(name = "creation_date")
    private Date creationDate;

    @UpdateTimestamp
    @Column(name = "modification_date")
    private Date modificationDate;

}
