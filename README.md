# shallty

Aplikasi untuk meng-crawl situs fastsub/fanshare Indonesia. Tujuan utamanya adalah untuk melewati berbagai halaman redirect dan mengambil tautan unduh aslinya. Saat ini Shallty telah mendukung crawling untuk ~~Meownime~~, Samehadaku, Neonime, Kusonime dan Oploverz. **Shallty juga mendukung crawling untuk satu situs baca manga, Kiryuu.**

Kunjungi https://shallty.moe/ untuk melihat satu contoh yang bisa dicapai menggunakan aplikasi ini.

## Instalasi
1. Instal [node.js](https://nodejs.org/en/).

2. Jalankan `npm install`.

3. Salin file `config.example.json` dan rename menjadi `config.json`.

4. Sesuaikan `config.json`.

5. Jalankan `node index.js` untuk memulai aplikasi. Kamu akan mendapatkan pesan server dan crawler ready jika tidak ada masalah.


## Penggunaan
### Dasar

- API path: `localhost:8080/api` (default port)

- Semua request melalui GET method

- Semua parameter `url` harus di-encode terlebih dahulu

### Endpoint

**/kiryuu/mangaList**

Keterangan: Mengambil daftar manga.

Contoh: `/kiryuu/mangaList`
<br/>
<br/>
<br/>
**/kiryuu/mangaInfo?link={url}**

Keterangan: Mengambil informasi manga.

Parameter:

-  `url` - url halaman manga tanpa domain (Contoh: /manga/iron-ladies/)

Contoh: `/kiryuu/mangaInfo?link=%2Fmanga%2Firon-ladies%2F`
<br/>
<br/>
<br/>
**/kiryuu/chapters?link={url}**

Keterangan: Mengambil daftar chapter manga.

Parameter:

-  `url` - url halaman manga tanpa domain (Contoh: /manga/iron-ladies/)

Contoh: `/kiryuu/chapters?link=%2Fmanga%2Firon-ladies`
<br/>
<br/>
<br/>
**/kiryuu/images?link={url}**

Keterangan: Mengambil daftar gambar dari satu chapter manga.

Parameter:

-  `url` - url halaman chapter manga tanpa domain (Contoh: /iron-ladies-chapter-99-bahasa-indonesia/)

Contoh: `/kiryuu/images?link=%2Firon-ladies-chapter-99-bahasa-indonesia%2F`
<br/>
<br/>
<br/>
**/kiryuu/newReleases**

Keterangan: Mengambil daftar rilisan terbaru dari Kiryuu.

Contoh: `/kiryuu/newReleases`
<br/>
<br/>
<br/>
**/samehadaku/anime?link={url}**

Keterangan: Mengambil daftar episode untuk 1 halaman kategori anime.

Parameter:

-  `url` - url halaman kategori (Contoh: https://www.samehadaku.tv/anime/dragon-ball-heroes/)

Contoh: `/samehadaku/anime?link=https%3A%2F%2Fwww.samehadaku.tv%2Fanime%2Fdragon-ball-heroes%2F`
<br/>
<br/>
<br/>
**/samehadaku/checkOnGoingPage**

Keterangan: Mengambil daftar rilisan terbaru.

Contoh: `/samehadaku/checkOnGoingPage`
<br/>
<br/>
<br/>
**/samehadaku/getDownloadLinks?link={url}**

Keterangan: Mengambil daftar tautan unduh dari halaman episode.

Parameter:

-  `url` - url halaman episode (Contoh: https://www.samehadaku.tv/dragon-ball-heroes-episode-15/)

Contoh: `/samehadaku/getDownloadLinks?link=https%3A%2F%2Fwww.samehadaku.tv%2Fdragon-ball-heroes-episode-15%2F`
<br/>
<br/>
<br/>
**/samehadaku/tetew?link={url}**

Keterangan: Mengambil tautan unduh asli dari shortlink tetew.com (sekarang anjay.info).

Parameter:

-  `url` - url shortlink tetew / anjay (Contoh: https://anjay.info/?id=VWErNWlBZmpCUlMvT0pxVH...)

Contoh: `/samehadaku/tetew?link=https%3A%2F%2Fanjay.info%2F%3Fid%3DVWErNWlBZmpCUlMvT0pxVHE3YS84c2Q0dExOcGF2M1lSam5GdEdDZnpmSnR4dmxrLzMrYXFNaGxadnZDTHBMag%3D%3D`
<br/>
<br/>
<br/>
**/samehadaku/njiir?link={url}**

Keterangan: Lihat bagian `/samehadaku/tetew?link={url}` di atas.


**/neonime/checkOnGoingPage**

Keterangan: Mengambil daftar rilisan terbaru.

Contoh: `/neonime/checkOnGoingPage`
<br/>
<br/>
<br/>
**/neonime/animeList**

Keterangan: Mengambil daftar anime di halaman anime list (https://neonime.org/episode/).

Contoh: `/neonime/animeList`
<br/>
<br/>
<br/>
**/neonime/tvShow?link={url}**

Keterangan: Mengambil daftar episode dari halaman tv show.

Parameter:

-  `url` - url halaman tv show (Contoh: https://neonime.org/tvshows/black-clover-subtitle-indonesia/)

Contoh: `/neonime/tvShow?link=https%3A%2F%2Fneonime.org%2Ftvshows%2Fblack-clover-subtitle-indonesia%2F`
<br/>
<br/>
<br/>
**/neonime/getEpisodes?link={url}**

Keterangan: Mengambil daftar tautan unduh dari halaman episode tv show.

Parameter:

-  `url` - url halaman episode tv show (Contoh: https://neonime.org/episode/black-clover-1x107/)

Contoh: `/neonime/getEpisodes?link=https%3A%2F%2Fneonime.org%2Fepisode%2Fblack-clover-1x107%2F`
<br/>
<br/>
<br/>
**/neonime/getBatchEpisodes?link={url}**

Keterangan: Mengambil daftar tautan unduh dari halaman episode batch.

Parameter:

-  `url` - url shortlink hightech (Contoh: https://neonime.org/batch/chihayafuru-season-2-bd-batch-subtitle-indonesia/)

Contoh: `/neonime/getBatchEpisodes?link=https%3A%2F%2Fneonime.org%2Fbatch%2Fchihayafuru-season-2-bd-batch-subtitle-indonesia%2F`
<br/>
<br/>
<br/>
**/neonime/hightech?link={url}**

Keterangan: Mengambil tautan unduh asli dari hightech (sekarang xmaster.xyz).

Parameter:

-  `url` - url shortlink hightech (Contoh: https://xmaster.xyz/?sitex=aHR0cHM6Ly93d3c3OS56aXBwe...)

Contoh: `/neonime/hightech?link=https%3A%2F%2Fxmaster.xyz%2F%3Fsitex%3DaHR0cHM6Ly93d3c3OS56aXBweXNoYXJlLmNvbS92LzFkNDZ3eWk3L2ZpbGUuaHRtbA%3D%3D`
<br/>
<br/>
<br/>
**/oploverz/checkOnGoingPage**

Keterangan: Mengambil daftar rilisan terbaru.

Contoh: `/oploverz/checkOnGoingPage`
<br/>
<br/>
<br/>
**/oploverz/series?link={url}**

Keterangan: Mengambil daftar episode dari halaman series.

Parameter:

-  `url` - url series (Contoh: https://www.oploverz.in/series/diamond-no-ace-s3/)

Contoh: `/oploverz/series?link=https%3A%2F%2Fwww.oploverz.in%2Fseries%2Fdiamond-no-ace-s3%2F`
<br/>
<br/>
<br/>
**/oploverz/getDownloadLinks?link={url}**

Keterangan: Mengambil daftar tautan unduh dari halaman episode.

Parameter:

-  `url` - url series (Contoh: https://www.oploverz.in/diamond-no-ace-s3-31-subtitle-indonesia/)

Contoh: `/oploverz/getDownloadLinks?link=https%3A%2F%2Fwww.oploverz.in%2Fdiamond-no-ace-s3-31-subtitle-indonesia%2F`
<br/>
<br/>
<br/>
**/oploverz/hexa?link={url}**

Keterangan: Mengambil tautan unduh asli dari hightech (sekarang xmaster.xyz).

Parameter:

-  `url` - url series (Contoh: https://www.oploverz.in/diamond-no-ace-s3-31-subtitle-indonesia/)

Contoh: `/oploverz/getDownloadLinks?link=https%3A%2F%2Fwww.oploverz.in%2Fdiamond-no-ace-s3-31-subtitle-indonesia%2F`
<br/>
<br/>
<br/>
**/kusonime/animeList**

Keterangan: Mengambil daftar anime dari halaman anime list.

Contoh: `/kusonime/animeList`
<br/>
<br/>
<br/>
**/kusonime/homePage?page={page}**

Keterangan: Mengambil daftar rilisan dari halaman home.

Parameter:

- `page` - nomor halaman (optional)

Contoh: `/kusonime/homePage?page=20`
<br/>
<br/>
<br/>
**/kusonime/getDownloadLinks?link={url}**

Keterangan: Mengambil daftar tautan unduh dari halaman rilisan.

Parameter:

-  `url` - url rilisan (Contoh: https://kusonime.com/sora-no-method-ova-batch-subtitle-indonesia/)

Contoh: `/kusonime/getDownloadLinks?link=https%3A%2F%2Fkusonime.com%2Fsora-no-method-ova-batch-subtitle-indonesia%2F`
<br/>
<br/>
<br/>
**/kusonime/semrawut?link={url}**

Keterangan: Mengambil tautan unduh asli dari shortlink semrawut/semawur/kepoow/sukakesehattan/jelajahinternet.

Parameter:

-  `url` - url shortlink (Contoh: https://kepoow.me/?r=aHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8xQjNlY2h4dEYwMFNUbVRRWklEcW8xUVJ3a1RHTmFSaXkvdmlldw==)

Contoh: `/kusonime/semrawut?link=https%3A%2F%2Fkepoow.me%2F%3Fr%3DaHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8xQjNlY2h4dEYwMFNUbVRRWklEcW8xUVJ3a1RHTmFSaXkvdmlldw%3D%3D`

## Bantuan, Lapor Bug, dan Kritik dan Saran

Server Discord: http://discord.gg/Ur4xJ4t
