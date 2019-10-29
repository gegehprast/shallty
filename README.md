
# shallty
Aplikasi untuk meng-crawl situs fastsub/fanshare Indonesia. Tujuan utamanya adalah untuk melewati berbagai halaman redirect dan mengambil tautan unduh aslinya. Saat ini Shallty telah mendukung crawling untuk ~~Meownime~~, Samehadaku, Neonime, Kusonime dan Oploverz.

### Instalasi
1. Instal [node.js](https://nodejs.org/en/).
2. Jalankan `npm install`.
3. Salin file `config.example.json` dan rename menjadi `config.json`.
4. Sesuaikan `config.json`.
5. Jalankan `node index.js` untuk memulai aplikasi.
6. Kunjungi localhost:8080 (Host dan Port default) di browser, kamu akan melihat `hello world` jika tidak ada masalah.

### Penggunaan
#### Endpoint
- /samehadaku/anime?link={url}
	> Keterangan: Mengambil daftar episode untuk 1 halaman kategori anime.
	> Parameter:
	> - `url` - url halaman kategori (Contoh: https://www.samehadaku.tv/anime/dragon-ball-heroes/)
	> Contoh: /samehadaku/anime?link=https%3A%2F%2Fwww.samehadaku.tv%2Fanime%2Fdragon-ball-heroes%2F

- /samehadaku/checkOnGoingPage
	> Keterangan: Mengambil daftar rilisan terbaru.
	> Contoh: /samehadaku/checkOnGoingPage
	
- /samehadaku/getDownloadLinks?link={url}
    > Keterangan: Mengambil daftar tautan unduh dari halaman episode.
	> Parameter:
	> - `url` - url halaman episode (Contoh: https://www.samehadaku.tv/dragon-ball-heroes-episode-15/)
	> Contoh: /samehadaku/getDownloadLinks?link=https%3A%2F%2Fwww.samehadaku.tv%2Fdragon-ball-heroes-episode-15%2F
    
- /samehadaku/tetew?link={url}
    > Keterangan: Mengambil tautan unduh asli dari shortlink tetew.com (sekarang anjay.info).
	> Parameter:
	> - `url` - url shortlink tetew / anjay (Contoh: https://anjay.info/?id=VWErNWlBZmpCUlMvT0pxVH...)
	> Contoh: /samehadaku/tetew?link=https%3A%2F%2Fanjay.info%2F%3Fid%3DVWErNWlBZmpCUlMvT0pxVHE3YS84c2Q0dExOcGF2M1lSam5GdEdDZnpmSnR4dmxrLzMrYXFNaGxadnZDTHBMag%3D%3D

- /samehadaku/njiir?link={url}
    > Keterangan: Lihat bagian `/samehadaku/tetew?link={url}` di atas.


- /neonime/checkOnGoingPage
    > Keterangan: Mengambil daftar rilisan terbaru.
	> Contoh: /neonime/checkOnGoingPage

- /neonime/animeList
    > Keterangan: Mengambil daftar anime di halaman anime list (https://neonime.org/episode/).
	> Contoh: /neonime/animeList

- /neonime/tvShow?link={url}
    > Keterangan: Mengambil daftar episode dari halaman tv show.
	> Parameter:
	> - `url` - url halaman tv show (Contoh: https://neonime.org/tvshows/black-clover-subtitle-indonesia/)
	> Contoh: /neonime/tvShow?link=https%3A%2F%2Fneonime.org%2Ftvshows%2Fblack-clover-subtitle-indonesia%2F

- /neonime/getEpisodes?link={url}
    > Keterangan: Mengambil daftar tautan unduh dari halaman episode tv show.
	> Parameter:
	> - `url` - url halaman episode tv show (Contoh: https://neonime.org/episode/black-clover-1x107/)
	> Contoh: /neonime/getEpisodes?link=https%3A%2F%2Fneonime.org%2Fepisode%2Fblack-clover-1x107%2F

- /neonime/getBatchEpisodes?link={url}
    > Keterangan: Mengambil daftar tautan unduh dari halaman episode batch.
	> Parameter:
	> - `url` - url shortlink hightech (Contoh: https://neonime.org/batch/chihayafuru-season-2-bd-batch-subtitle-indonesia/)
	> Contoh: /neonime/getBatchEpisodes?link=https%3A%2F%2Fneonime.org%2Fbatch%2Fchihayafuru-season-2-bd-batch-subtitle-indonesia%2F

- /neonime/hightech?link={url}
    > Keterangan: Mengambil tautan unduh asli dari hightech (sekarang xmaster.xyz).
	> Parameter:
	> - `url` - url shortlink hightech (Contoh: https://xmaster.xyz/?sitex=aHR0cHM6Ly93d3c3OS56aXBwe...)
	> Contoh: /neonime/hightech?link=https%3A%2F%2Fxmaster.xyz%2F%3Fsitex%3DaHR0cHM6Ly93d3c3OS56aXBweXNoYXJlLmNvbS92LzFkNDZ3eWk3L2ZpbGUuaHRtbA%3D%3D


- /oploverz/checkOnGoingPage
    > Keterangan: Mengambil daftar rilisan terbaru.
	> Contoh: /oploverz/checkOnGoingPage

- /oploverz/series?link={url}
    > Keterangan: Mengambil daftar episode dari halaman series.
	> Parameter:
	> - `url` - url series (Contoh: https://www.oploverz.in/series/diamond-no-ace-s3/)
	> Contoh: /oploverz/series?link=https%3A%2F%2Fwww.oploverz.in%2Fseries%2Fdiamond-no-ace-s3%2F

- /oploverz/getDownloadLinks?link={url}
    > Keterangan: Mengambil daftar tautan unduh dari halaman episode.
	> Parameter:
	> - `url` - url series (Contoh: https://www.oploverz.in/diamond-no-ace-s3-31-subtitle-indonesia/)
	> Contoh: /oploverz/getDownloadLinks?link=https%3A%2F%2Fwww.oploverz.in%2Fdiamond-no-ace-s3-31-subtitle-indonesia%2F

- /oploverz/hexa?link={url}
    > Keterangan: Mengambil tautan unduh asli dari hightech (sekarang xmaster.xyz).
	> Parameter:
	> - `url` - url series (Contoh: https://www.oploverz.in/diamond-no-ace-s3-31-subtitle-indonesia/)
	> Contoh: /oploverz/getDownloadLinks?link=https%3A%2F%2Fwww.oploverz.in%2Fdiamond-no-ace-s3-31-subtitle-indonesia%2F


- /kusonime/animeList
    > Keterangan: Mengambil daftar anime dari halaman anime list.

- /kusonime/homePage?page={page}
    > Keterangan: Mengambil daftar rilisan dari halaman home.
	> Parameter:
	- `page` - nomor halaman (optional)
	> Contoh: /kusonime/homePage?page=20

- /kusonime/getDownloadLinks?link={url}
    > Keterangan: Mengambil daftar tautan unduh dari halaman rilisan.
	> Parameter:
	> - `url` - url rilisan (Contoh: https://kusonime.com/sora-no-method-ova-batch-subtitle-indonesia/)
	> Contoh: /kusonime/getDownloadLinks?link=https%3A%2F%2Fkusonime.com%2Fsora-no-method-ova-batch-subtitle-indonesia%2F

- /kusonime/semrawut?link={url}
    > Keterangan: Mengambil tautan unduh asli dari shortlink semrawut/semawur/kepoow/sukakesehattan/jelajahinternet.
	> Parameter:
	> - `url` - url shortlink (Contoh: https://kepoow.me/?r=aHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8xQjNlY2h4dEYwMFNUbVRRWklEcW8xUVJ3a1RHTmFSaXkvdmlldw==)
	> Contoh: /kusonime/semrawut?link=https%3A%2F%2Fkepoow.me%2F%3Fr%3DaHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8xQjNlY2h4dEYwMFNUbVRRWklEcW8xUVJ3a1RHTmFSaXkvdmlldw%3D%3D