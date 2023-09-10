// mengambil data judul dari halaman index
const data_filtered = JSON.parse(
  document.getElementById("scrpt_get_local").innerText
);

// mengambil data kamus sinonim dari halaman index
const kamus_sinonim = JSON.parse(
  document.getElementById("scrpt_get_locals").innerText
);

// fungsi untuk mengubah kata yang dimasukkan menjadi object
const kamus_sinonim_obj = {};

for (let i = 0; i < kamus_sinonim.length; i++) {
  const entry = kamus_sinonim[i];
  const kataKunci = entry.KataKunci;
  const sinonim = entry.Sinonim.split(", ");
  kamus_sinonim_obj[kataKunci] = sinonim;
}

// Mengambil id dan class
const btnSearch = document.getElementById("btnSearch");
const search = document.getElementsByName("keyword")[0];
const data_section = document.getElementsByClassName("row gutter")[0];

// event untuk handle ketika tombol search di klik
btnSearch.addEventListener("click", (event) => {
  event.preventDefault();
  searchData();
});

// event ketika menekan enter pada inputan search
search.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchData();
  }
});

// function jaro_distance(search_value, data_filtered) {
//   if (search_value === data_filtered) return 1.0;

//   const len1 = search_value.length;
//   const len2 = data_filtered.length;

//   if (len1 === 0 || len2 === 0) return 0.0;

//   const max_dist = Math.floor(Math.max(len1, len2) / 2);
//   const hash_s1 = new Array(len1).fill(0);
//   const hash_s2 = new Array(len2).fill(0);

//   let match = 0;
//   let t = 0; // Penambahan variabel untuk menghitung transpositions

//   for (let i = 0; i < len1; i++) {
//     for (
//       let j = Math.max(0, i - max_dist), len = Math.min(len2, i + max_dist + 1);
//       j < len;
//       j++
//     ) {
//       if (search_value[i] === data_filtered[j] && hash_s2[j] === 0) {
//         hash_s1[i] = 1;
//         hash_s2[j] = 1;
//         match++;
//         break;
//       }
//     }
//   }

//   if (match === 0) return 0.0;

//   // Menghitung transpositions
//   let transpositions = 0;
//   let k = 0;
//   for (let i = 0; i < len1; i++) {
//     if (hash_s1[i] === 1) {
//       while (hash_s2[k] === 0) k++;
//       if (search_value[i] !== data_filtered[k]) transpositions++;
//       k++;
//     }
//   }

//   transpositions /= 2;

//   return (match / len1 + match / len2 + (match - transpositions) / match) / 3.0;
// }

// function jaro_Winkler(search_value, data_filtered) {
//   const jaro_dist = jaro_distance(
//     search_value.toLowerCase(),
//     data_filtered.toLowerCase()
//   ); // Ubah kedua parameter menjadi lowercase

//   if (jaro_dist >= 0.9) {
//     let prefix = 0;

//     for (
//       let i = 0, len = Math.min(search_value.length, data_filtered.length);
//       i < len;
//       i++
//     ) {
//       if (search_value[i] === data_filtered[i]) prefix++;
//       else break;
//     }

//     prefix = Math.min(4, prefix);

//     return parseFloat((jaro_dist + 0.1 * prefix * (1 - jaro_dist)).toFixed(6));
//   }

//   return jaro_dist.toFixed(6);
// }
// const coba2 = "perncangn";
// const coba = "perancangan";
// const dj = jaro_distance(coba2, coba);
// const hasil = jaro_Winkler(coba2, coba);
// console.log(dj);
// console.log(hasil);

// Javascript implementation of above approach

// Function to calculate the
// Jaro Similarity of two strings
function jaro_distance(s1, s2) {
  // If the strings are equal
  if (s1 == s2) return 1.0;

  // Length of two strings
  let len1 = s1.length,
    len2 = s2.length;

  if (len1 == 0 || len2 == 0) return 0.0;

  // Maximum distance upto which matching
  // is allowed
  let max_dist = Math.floor(Math.max(len1, len2) / 2) - 1;

  // Count of matches
  let match = 0;

  // Hash for matches
  let hash_s1 = new Array(s1.length);
  hash_s1.fill(0);
  let hash_s2 = new Array(s2.length);
  hash_s2.fill(0);

  // Traverse through the first string
  for (let i = 0; i < len1; i++) {
    // Check if there is any matches
    for (
      let j = Math.max(0, i - max_dist);
      j < Math.min(len2, i + max_dist + 1);
      j++
    )
      // If there is a match
      if (s1[i] == s2[j] && hash_s2[j] == 0) {
        hash_s1[i] = 1;
        hash_s2[j] = 1;
        match++;
        break;
      }
  }

  // If there is no match
  if (match == 0) return 0.0;

  // Number of transpositions
  let t = 0;

  let point = 0;

  // Count number of occurrences
  // where two characters match but
  // there is a third matched character
  // in between the indices
  for (let i = 0; i < len1; i++)
    if (hash_s1[i] == 1) {
      // Find the next matched character
      // in second string
      while (hash_s2[point] == 0) point++;

      if (s1[i] != s2[point++]) t++;
    }
  t /= 2;

  // Return the Jaro Similarity
  return (match / len1 + match / len2 + (match - t) / match) / 3.0;
}

// Jaro Winkler Similarity
function jaro_Winkler(s1, s2) {
  let jaro_dist = jaro_distance(s1, s2);

  // If the jaro Similarity is above a threshold
  if (jaro_dist > 0.9) {
    // Find the length of common prefix
    let prefix = 0;

    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
      // If the characters match
      if (s1[i] == s2[i]) prefix++;
      // Else break
      else break;
    }

    // Maximum of 4 characters are allowed in prefix
    prefix = Math.min(4, prefix);
    console.log("prefix " + prefix);

    // Calculate jaro winkler Similarity
    jaro_dist += 0.1 * prefix * (1 - jaro_dist);
  }
  return jaro_dist.toFixed(6);
}

let s1 = "pengajian",
  s2 = "pengairan";

// Print Jaro-Winkler Similarity of two strings
console.log("Jaro-distance =" + jaro_distance(s1, s2));
console.log("Jaro-Winkler =" + jaro_Winkler(s1, s2));

// fungsi mencari data
function searchData() {
  const startTime = performance.now();
  const search_value = search.value;
  data_section.innerHTML = ""; // Mengosongkan hasil pencarian sebelumnya
  try {
    if (search_value && search_value.trim() !== "") {
      // Mengkonversi search_value menjadi lowercase
      let search_lower = search_value.toLowerCase();

      // Memisahkan kata kunci pencarian menjadi kata-kata individu
      const keywords = search_lower.split(" ");

      // Melakukan pencarian
      let foundExactMatch = false; // Flag untuk menandai apakah ada kecocokan persis yang ditemukan

      for (let i = 0; i < data_filtered.length; i++) {
        const judul = data_filtered[i].Judul_Skripsi;
        const nama = data_filtered[i].Nama_Pengarang;
        const nmr = data_filtered[i].Nomor_Reg_Induk;
        const jurusan = data_filtered[i].Penerbit;

        if (judul) {
          const judul_lower = judul.toLowerCase();
          // Cek apakah semua kata kunci ditemukan dalam judul
          const allKeywordsFound = keywords.every((keyword) =>
            judul_lower.includes(keyword)
          );

          if (allKeywordsFound) {
            // Jika judul mengandung semua kata kunci, tampilkan hasil pencarian
            data_section.innerHTML += `<div class="col-md-3">
            <div class="card m-3">
              <div class="card-body">
                <h5 class="card-header">
                  Nomor Registrasi:
                  <span class="white">${nmr}</span>
                </h5>
                <h6 class="card-title">${judul}</h6>
                <p class="card-text">
                  ${nama}<br />
                  ${jurusan}
                </p>
              </div>
            </div>
          </div>
            `;
            foundExactMatch = true;
          } else if (keywords.length >= 1 && !allKeywordsFound) {
            const userInput = keywords[0].toLowerCase();
            // Cek apakah judul mengandung kata yang dimasukkan oleh pengguna
            let containsUserInput = false;
            for (let k = 0; k < data_filtered.length; k++) {
              const alternativeJudul = data_filtered[k].Judul_Skripsi;
              if (
                alternativeJudul &&
                alternativeJudul.toLowerCase().includes(userInput)
              ) {
                containsUserInput = true;
                break;
              }
            }

            if (!containsUserInput) {
              let matchedData = {}; // Objek untuk menyimpan judul dan nama yang cocok dengan sinonim
              let matchednmr = {};
              let matchedjurusan = {};

              const userInputKeywords = search_value.toLowerCase().split(" "); // Membagi input pengguna menjadi kata kunci

              // Pencocokan dengan judul
              data_filtered.forEach((data) => {
                const alternativeJudul = data.Judul_Skripsi; // Judul skripsi dari data
                const nama1 = data.Nama_Pengarang; // Nama pengarang dari data
                const nmrregis = data.Nomor_Reg_Induk;
                const jurusan = data.Penerbit;

                if (alternativeJudul) {
                  const judulLowerCase = alternativeJudul.toLowerCase(); // Mengonversi judul menjadi lowercase
                  const judulKeywords = judulLowerCase.split(" "); // Membagi judul menjadi kata kunci

                  judulKeywords.forEach((judulKeyword) => {
                    userInputKeywords.forEach((keyword) => {
                      // Perbarui userInputKeywords dengan keyword saat ini
                      const similarity = jaro_Winkler(
                        keyword.toLowerCase(),
                        judulKeyword.toLowerCase()
                      ); // Menghitung kesamaan antara kata kunci pengguna dan kata kunci judul
                      if (similarity > 0.9) {
                        matchedData[alternativeJudul] = nama1; // Menyimpan judul dan nama yang cocok
                        matchednmr[alternativeJudul] = nmrregis;
                        matchedjurusan[alternativeJudul] = jurusan;
                        foundMatch = true; // Mengubah foundMatch menjadi true
                      }
                    });
                  });
                }
              });

              // Pencocokan dengan sinonim
              userInputKeywords.forEach((keyword) => {
                kamus_sinonim.forEach((entry) => {
                  const kataKunci = entry.KataKunci; // Kata kunci sinonim
                  const similarity = jaro_Winkler(keyword, kataKunci); // Menghitung kesamaan antara kata kunci pengguna dan kata kunci sinonim

                  if (similarity > 0.9) {
                    const sinonim = entry.Sinonim.split(", "); // Daftar sinonim
                    data_filtered.forEach((data) => {
                      const alternativeJudul = data.Judul_Skripsi; // Judul skripsi dari data
                      const nama1 = data.Nama_Pengarang; // Nama pengarang dari data
                      const nmrregis = data.Nomor_Reg_Induk;
                      const jurusan = data.Penerbit;

                      if (alternativeJudul) {
                        const judulLowerCase = alternativeJudul.toLowerCase(); // Mengonversi judul menjadi lowercase

                        if (
                          sinonim.some((sinonimKunci) =>
                            judulLowerCase.includes(sinonimKunci.toLowerCase())
                          ) ||
                          jaro_Winkler(
                            judulLowerCase,
                            search_value.toLowerCase()
                          ) > 0.9 ||
                          userInputKeywords.every((keyword) =>
                            judulLowerCase.includes(keyword.toLowerCase())
                          )
                        ) {
                          matchedData[alternativeJudul] = nama1; // Menyimpan judul dan nama yang cocok
                          matchednmr[alternativeJudul] = nmrregis;
                          matchedjurusan[alternativeJudul] = jurusan;
                          foundMatch = true; // Mengubah foundMatch menjadi true
                        }
                      }
                    });
                  }
                });
              });

              const matchedTitles = Object.keys(matchedData); // Mendapatkan judul-judul yang cocok
              foundExactMatch = false;
              if (matchedTitles.length > 0) {
                data_section.innerHTML = "<p>Mungkin maksud Anda:</p>";

                matchedTitles.forEach((matchedTitle) => {
                  data_section.innerHTML += `
                <div class="col-md-3">
                  <div class="card m-3">
                    <div class="card-body">
                      <h5 class="card-header">
                        Nomor Registrasi:
                        <span class="white"> ${matchednmr[matchedTitle]}</span>
                      </h5>
                      <h6 class="card-title">${matchedTitle}</h6>
                      <p class="card-text">
                        ${matchedData[matchedTitle]}<br />
                        ${matchedjurusan[matchedTitle]}
                      </p>
                    </div>
                  </div>
                </div>`;
                });
                data_section.innerHTML = suggestionsHTML;
                foundExactMatch = true; // Mengubah foundExactMatch menjadi true
              }
            }
          }
        }
      }
      if (!foundExactMatch) {
        // Jika tidak ada kecocokan persis, cek kata yang paling mirip menggunakan Jaro-Winkler Distance
        let bestMatch = "";
        let nmr_regis = "";
        let nama = "";
        let Penerbit = "";
        let bestSimilarity = 0;

        for (let i = 0; i < data_filtered.length; i++) {
          const judul = data_filtered[i].Judul_Skripsi;
          const regis = data_filtered[i].Nomor_Reg_Induk;
          const _nama = data_filtered[i].Nama_Pengarang;
          const jurusan = data_filtered[i].Penerbit;

          if (judul) {
            const judul_lower = judul.toLowerCase();
            const similarity = jaro_Winkler(search_lower, judul_lower);

            if (similarity > bestSimilarity) {
              bestSimilarity = similarity;
              bestMatch = judul;
              nmr_regis = regis;
              nama = _nama;
              Penerbit = jurusan;
            }
          }
        }

        if (bestSimilarity > 0.8) {
          // Jika similarity terbaik lebih besar dari threshold, tampilkan sebagai saran alternatif
          const highlightedBestMatch = highlightIncorrectWord(
            search_lower,
            bestMatch
          );
          data_section.innerHTML += "<p>Mungkin Maksud Anda : </p>";
          data_section.innerHTML += `<div class="col-md-3">
                  <div class="card m-3">
                    <div class="card-body">
                      <h5 class="card-header">
                        Nomor Registrasi:
                        <span class="white">${nmr_regis}</span>
                      </h5>
                      <h6 class="card-title">${highlightedBestMatch}</h6>
                      <p class="card-text">
                        ${nama}<br />
                        ${Penerbit}
                      </p>
                    </div>
                  </div>
                </div>`;
        } else {
          // Jika tidak ada kata yang mirip ditemukan, tampilkan pesan tidak ditemukan
          data_section.innerHTML += "<p>Tidak ditemukan hasil yang cocok.</p>";
        }
      }
    } else {
      // Jika tidak ada input judul, tampilkan pesan bahwa judul tidak ditampilkan
      data_section.innerHTML +=
        "<p>Judul tidak ditampilkan. Masukkan kata kunci pencarian.</p>";
    }
  } catch (error) {
    console.log(error);
  }

  const endTime = performance.now(); // Catat waktu selesai eksekusi
  const executionTimeInMilliseconds = endTime - startTime; // Hitung durasi eksekusi dalam milidetik
  const executionTimeInSeconds = Math.floor(executionTimeInMilliseconds); // Konversi ke bilangan bulat detik

  console.log(
    `Waktu eksekusi searchData(): ${executionTimeInSeconds} milidetik`
  );
}

// Fungsi untuk menghighlight kata yang salah
function highlightIncorrectWord(input, text) {
  const inputWords = input.split(" ");
  const textWords = text.split(" ");

  let highlightedText = "";

  for (let i = 0; i < inputWords.length; i++) {
    if (inputWords[i].toLowerCase() !== textWords[i].toLowerCase()) {
      highlightedText +=
        "<span style='color: red;'>" + textWords[i] + "</span> ";
    } else {
      highlightedText += textWords[i] + " ";
    }
  }

  return highlightedText.trim();
}
