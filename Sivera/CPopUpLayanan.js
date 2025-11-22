import React from 'react';
import styles from './c_pop-up-layanan.module.css';

const CPopUpLayanan = ({ isVisible = false, ...props }) => {
  const services = [
    { id: 1, name: 'Layanan Autodebit', link: '/layanan/autodebit' },
    { id: 2, name: 'Program Rehab', link: '/layanan/rehab' },
    { id: 3, name: 'Program Pesiar', link: '/layanan/pesiar' },
    { id: 4, name: 'Data Peserta', link: '/layanan/data-peserta' },
    { id: 5, name: 'Alamat BPJS Kesehatan', link: '/layanan/alamat' },
  ];

  const containerClasses = `${styles['c-pop-up-layanan-dropdown']} ${isVisible ? styles['visible'] : ''}`;

  return (
    <div className={containerClasses} {...props}>
      <ul className={styles['layanan-list']}>
        {services.map((service) => (
          <li key={service.id} className={styles['layanan-item']}>
            <a href={service.link} className={styles['layanan-link']}>
              {service.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CPopUpLayanan;
