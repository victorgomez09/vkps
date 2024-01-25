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
import lombok.ToString;

@Entity
@Table(name = "addons")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class AddonEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;

	@Column(name = "name", unique = true)
	private String name;

	@Column(name = "fancy_name")
	private String fancyName;

	@Column(name = "image")
	private String image;

	@Column(name = "info_url")
	private String infoUrl;

	@Column(name = "description")
	private String description;

	@Column(name = "logo", columnDefinition = "TEXT")
	private String logo;

	@Column(name = "port")
	private int port;
	
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "addon")
	private List<AddonEnvEntity> envs;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "addon")
	private List<AddonVolumeEntity> volumes;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "addon")
	private List<AddonVersionEntity> versions;

	@CreationTimestamp
	@Column(name = "creation_date")
	private Date creationDate;

	@UpdateTimestamp
	@Column(name = "modification_date")
	private Date modificationDate;
}
