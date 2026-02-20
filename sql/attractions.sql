CREATE TABLE attractions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sub_district_id VARCHAR(6), 
    location TEXT,
    open_hour VARCHAR(100),
    tel VARCHAR(20),
    ig VARCHAR(50),
    facebook VARCHAR(50),
    google_maps_url TEXT,
    description TEXT,
    thumbnail VARCHAR(255),
    FOREIGN KEY (sub_district_id) REFERENCES sub_districts(id) ON DELETE SET NULL
) ENGINE=InnoDB;


CREATE TABLE attraction_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attraction_id INT,
    file_path VARCHAR(255),
    FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE
) ENGINE=InnoDB;