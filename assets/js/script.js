const SHEET_ID = '1vF0D_WJXH5RUC7liF3fbcZCrLvre_xEGFGTD3FDYq1U';
const SHEET_GID = '0';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&tq&gid=${SHEET_GID}`;

let JSON_SPREADSHEET = ``;

let allProducts = [];
let searchOffcanvasTimeout;

// Seleção dinâmica do número do WhatsApp conforme dia/horário
function getWhatsappNumber() {
  // Força o cálculo baseado no fuso horário de Brasília (GMT-3)
  const now = new Date(); // Exemplo de data fixa para testes
  console.log(now)
  const brDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

  const day = brDate.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  const totalMinutes = brDate.getHours() * 60 + brDate.getMinutes();

  const START_BUSINESS = 9 * 60;    // 09:00
  const END_BUSINESS = 18 * 60;     // 18:00
  const END_WEEKDAY = 18 * 60;      // 18:00
  const END_SATURDAY = 14 * 60;     // 14:00

  const MAIN_NUMBER = '5584999284842'; // Leticia
  const SUPPORT_NUMBER = '5584999284842'; // 

  let isBusinessHours = false;

  if (day >= 1 && day <= 5) {
    // Segunda a Sexta: 09:00 às 18:00
    isBusinessHours = totalMinutes >= START_BUSINESS && totalMinutes < END_WEEKDAY;
  } else if (day === 6) {
    // Sábado: 09:00 às 14:00
    isBusinessHours = totalMinutes >= START_BUSINESS && totalMinutes < END_SATURDAY;
  }
  // Domingo (day 0) cai automaticamente no suporte

  return isBusinessHours ? MAIN_NUMBER : SUPPORT_NUMBER;
}


function openWhatsapp(message) {
  const number = getWhatsappNumber();
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  const whatsappButton = document.getElementById('whatsapp-header-btn');

  if (whatsappButton) {
    whatsappButton.addEventListener('click', (event) => {
      event.preventDefault();
      openWhatsapp('Olá, vim pelo site. Queria falar com o atendimento ao cliente.');
    });
  }
});

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const normalized = String(value).trim();
    if (normalized) return normalized;
  }
  return '';
}

function getProductImagePath(nomeProduto) {
  const normalized = String(nomeProduto || '').toUpperCase().trim();
  const imageMap = {
    'IPHONE 11': 'assets/IPhones/iPhone 11/iPhone 11/ip11.png',
    'IPHONE 11 PRO': 'assets/IPhones/iPhone 11/iPhone 11 Pro/iph11pro.jpg',
    'IPHONE 11 PRO MAX': 'assets/IPhones/iPhone 11/iPhone 11 Pro Max/iph11pro.jpg',
    'IPHONE 12': 'assets/IPhones/iPhone 12/iPhone 12/image.png',
    'IPHONE 12 PRO': 'assets/IPhones/iPhone 12/iPhone 12 Pro/image.png',
    'IPHONE 12 PRO MAX': 'assets/IPhones/iPhone 12/iPhone 12 Pro Max/image.png',
    'IPHONE 13': 'assets/IPhones/iPhone 13/iPhone 13/image.png',
    'IPHONE 13 PRO': 'assets/IPhones/iPhone 13/iPhone 13 Pro/image.png',
    'IPHONE 13 PRO MAX': 'assets/IPhones/iPhone 13/iPhone 13 Pro Max/image.png',
    'IPHONE 14': 'assets/IPhones/iPhone 14/iPhone 14/image.png',
    'IPHONE 14 PLUS': 'assets/IPhones/iPhone 14/iPhone 14 Plus/image.png',
    'IPHONE 14 PRO': 'assets/IPhones/iPhone 14/iPhone 14 Pro/image.png',
    'IPHONE 14 PRO MAX': 'assets/IPhones/iPhone 14/iPhone 14 Pro Max/image.png',
    'IPHONE 15': 'assets/IPhones/iPhone 15/iPhone 15/image.png',
    'IPHONE 15 PLUS': 'assets/IPhones/iPhone 15/iPhone 15 Plus/image.png',
    'IPHONE 15 PRO': 'assets/IPhones/iPhone 15/iPhone 15 Pro/image.png',
    'IPHONE 15 PRO MAX': 'assets/IPhones/iPhone 15/iPhone 15 Pro Max/image.png',
    'IPHONE 16': 'assets/IPhones/iPhone 16/iPhone 16/image.png',
    'IPHONE 16 PRO': 'assets/IPhones/iPhone 16/iPhone 16 Pro/image.png',
    'IPHONE 16 PRO MAX': 'assets/IPhones/iPhone 16/iPhone 16 Pro Max/image.png',
    'IPHONE 17': 'assets/IPhones/iPhone 17/iPhone 17/image.png',
    'IPHONE 17 PRO': 'assets/IPhones/iPhone 17/iPhone 17 Pro/image.png',
    'IPHONE 17 PRO MAX': 'assets/IPhones/iPhone 17/iPhone 17 Pro Max/image.png'
  };

  return imageMap[normalized] || '';
}

/**
 * Busca o caminho da imagem em um CDN externo.
 */
function getCDNImagePath(nomeProduto) {
  const normalized = String(nomeProduto || '').toUpperCase().trim();
  const cdnMap = {
    'IPHONE 11': 'https://lh3.googleusercontent.com/rd-d/ALs6j_EjPkaZPZoS2-Dq2WcStnWjN5ryJTPuzgorXCJwQzOLls6a_25m8TSTTV4WPzztdbCENbr64KZHyJR8AK7CWBxskECM05Qp6g0QfVRDQ_xMGPw9zStX8_yzfmlB-o9i0C9nHtgukC2waSzK-E-pIzZT6fk-HwMnRjPut2i5Uc-CdK0JCLVQ1qLSoxAyouX62p0W4sefWImuJQ7bbociRrA6g0p8mevBtOHXsSO-n-23syV20_jA3pD4Q2Nwrj-lU9_2AiscMq9Mfacto8mpBS7koTniyp9Kc8IlVeB_hQ29m6A_KoBlmD2Ohvx98aEgzdNFOG1kQViPUWu_A1YuC3i3YvwevwR0iWsXNRJR_CXWxtOeweW4q0FihTXCnrMfWdSoGKoaeSxyG1IC-jU7H5JXPbMhHl74DVmAJ2qZdoNQ1yvlyoHZgC89DNiirt7PqxdtaAtU2kMBzsETBhH7YUdIyiB6FvUqrZM31Dt0HWL7_xy0DCmj8zynhi4w3g5Q_EZDQI_RcfNNTIFcH5CQ_DzhlvAzEDcadWA1GyfpMX-73LdTc5Q9dYA0mo1gZYgTgsZQtOJ678GGV7fm7PSOE31IRZ3nSeJ7MI-Nza7QN94WfNJRPUDP8jmc1nl_LL4dhTY11szNT8WCQWFz9SPtOajaNjsGZM4LYYmcwvC6PWUiTARP0RyVgdW6RtTRLh0z5u8pGZDUHWAsjTNqFhDzsrshjqObiA5CYf8AGGas6bOuV9V3NXUt1GHqbG4hVdRHyi_yGBXjQSPCSY4Z5yWqUCam5R6KROHC2UJGkPnIuGnaVVL_XASmb_fRI2t9flCvC27mRimoY9nzN3ZWJQIUTi9A15C8R0qFCHH2y5oASpMupa1A4a-xmvMYT4WUk_drmX3uZOPYgSc-pzpjPIbLb2SxUS9XMoJw5yy3RVZ_kq5eZrFv552vdmHSrj6iBpZJh3EvxtTNg_i_ZsJL1qSL0SndNfTrPwOEDOMra268g7Z3F4tdojfiEcpz0SuN80bGJAaH1LCGWkGtTLHGJmofeh06je2ch2kVfKqyAM1qB9oldgrjwrG4fDmL9GdGvOT5Y-37aFY5hBRSnnBIVVa7lDZGN66VLtjGnlzPtv-DaliKhQ5FkV9xxL6WQjrCY_sIHCYxtolb2j71R5gX7eTuIccdCyOcZEFzhoam9w=w1870-h919?auditContext=prefetch',
    'IPHONE 11 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_GM8wJx7IvddjQHzURpwLmEElVQw8FKVjD8aUWrrNDnQklKhbjYH6ToFpkHIZnIyh_pcTmOTNzSqjYHLWSpVwZPd-iZVpuj5eObt4yU8LPWi-s2ZmHnFXdCknbrAzEPdPSpR3n9u0h5E7Z9KD5JwcBhh5MNX6RvkwGXXcLT-1yCiJoSXZGXbYCyZDr7NyARhGitcJ294_Kfwwvobk3XjaJzD9CH3AuVUDbLWEjsxuk5t701QhkkSvtkl8mfwPtIkKZB9ayMDGBk7hVvfTIe421sQPaY7VwZI45asnuQF7bBcd3IUWZ2bESCBGJ2Fex4vhK_y9NigrDqi5GuQg1FKI09IWXS1q4yo2yEIWxKN91YHSJaAXxUsHTjRd_ceaD3leJTgrbfWq4Lj2Y67pPaUBmYNJZGEk03ArmRu8JjcsuI8ckEw0VoyU-XU0YHH3H-ledpTgPfuWaAQPjsTZgZcYfY_uqsnWw49HBytVuZSzZsSQSP7gw90tcImHogaNI__5ebo4LJ6CWWj_Ea4I-lt0A-XTD9Nv9JK7-RBoKum7_eF_5ZD9DRWqlcr3Z1yYZ9BZslG2TWSErIUkQ_U46ydlPh06JTQupNJwUYg8y97NpwFKm7dQ-XVjNdqvzKkjhsSt6_qLYtJumCK7OK3J8YyJP_H8bCHiStK45rxTDs8le6cxu0b6ZDjINVFDiEyB2LeMwXK8iFcoMlaJvaK5PUm1fuytR6JJzxkzheYSJrjYwBQbAbB7DNQd76lEVMiJcPRRllVz_0B3UCQX5CGOwspznzVGAiH9fxiGj2UFEp5i_xp6ZMAcyCG9AFdSpA_lHVR3YeRaG_1-DdaaUk_zoBWAxiR46ZlwSj1FALGnzgAZWhn3WymApS--gQDofAu00eJrmogWYiUmAhkcHgIS4XOzoJNpnwu0jRnUQZ4-jr4uMa8Ym_07-BQqQZS64YF3gJzbZgifWfTI8ocoSwyZxF3uLUQvhfDEurfMy4zBu6LItSZscIYwBPgZOTJTJx2kaJTHf5eB4rFdDSnSG1L7jKfhRPg7f-6YiXZIGpyXj0nbXYcRL9Kp1Db-dchls_w7A41bz_9Kvc7-apHumeWR8EnN2KZTNDsfQnezIOwVVKkYhU0L9PNui_aAZoKNRQuW8hrHVZGKA92aab_K4pIF9qTuLTNVZ9ex2wGxaaHw=w1426-h911?auditContext=forDisplay',
    'IPHONE 11 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_GM8wJx7IvddjQHzURpwLmEElVQw8FKVjD8aUWrrNDnQklKhbjYH6ToFpkHIZnIyh_pcTmOTNzSqjYHLWSpVwZPd-iZVpuj5eObt4yU8LPWi-s2ZmHnFXdCknbrAzEPdPSpR3n9u0h5E7Z9KD5JwcBhh5MNX6RvkwGXXcLT-1yCiJoSXZGXbYCyZDr7NyARhGitcJ294_Kfwwvobk3XjaJzD9CH3AuVUDbLWEjsxuk5t701QhkkSvtkl8mfwPtIkKZB9ayMDGBk7hVvfTIe421sQPaY7VwZI45asnuQF7bBcd3IUWZ2bESCBGJ2Fex4vhK_y9NigrDqi5GuQg1FKI09IWXS1q4yo2yEIWxKN91YHSJaAXxUsHTjRd_ceaD3leJTgrbfWq4Lj2Y67pPaUBmYNJZGEk03ArmRu8JjcsuI8ckEw0VoyU-XU0YHH3H-ledpTgPfuWaAQPjsTZgZcYfY_uqsnWw49HBytVuZSzZsSQSP7gw90tcImHogaNI__5ebo4LJ6CWWj_Ea4I-lt0A-XTD9Nv9JK7-RBoKum7_eF_5ZD9DRWqlcr3Z1yYZ9BZslG2TWSErIUkQ_U46ydlPh06JTQupNJwUYg8y97NpwFKm7dQ-XVjNdqvzKkjhsSt6_qLYtJumCK7OK3J8YyJP_H8bCHiStK45rxTDs8le6cxu0b6ZDjINVFDiEyB2LeMwXK8iFcoMlaJvaK5PUm1fuytR6JJzxkzheYSJrjYwBQbAbB7DNQd76lEVMiJcPRRllVz_0B3UCQX5CGOwspznzVGAiH9fxiGj2UFEp5i_xp6ZMAcyCG9AFdSpA_lHVR3YeRaG_1-DdaaUk_zoBWAxiR46ZlwSj1FALGnzgAZWhn3WymApS--gQDofAu00eJrmogWYiUmAhkcHgIS4XOzoJNpnwu0jRnUQZ4-jr4uMa8Ym_07-BQqQZS64YF3gJzbZgifWfTI8ocoSwyZxF3uLUQvhfDEurfMy4zBu6LItSZscIYwBPgZOTJTJx2kaJTHf5eB4rFdDSnSG1L7jKfhRPg7f-6YiXZIGpyXj0nbXYcRL9Kp1Db-dchls_w7A41bz_9Kvc7-apHumeWR8EnN2KZTNDsfQnezIOwVVKkYhU0L9PNui_aAZoKNRQuW8hrHVZGKA92aab_K4pIF9qTuLTNVZ9ex2wGxaaHw=w1426-h911?auditContext=forDisplay',

    'IPHONE 12': 'https://lh3.googleusercontent.com/rd-d/ALs6j_GqcQGk0Vk-a81PyJghu_xMum-EBKu-nKfeQShbZj6wCzZm4Kc-sCO6EZ6BQo3RzksRMi6nV6cPTrL1Ybed1JxWdumJ1odOdtRosHDRFf4vm7py3KMmpegwqZo-7o5Jft_GzN31JpK2MUZf8PX0mJFjeyqixXHXu0aQSBAJVxADB-ANC-2OB0ECi7I9kqHr1A3Etr8b-2-0QWBc09OquI5eFKarVgn3gsx3_0rIvKbAEgLwCHlM3u4L1RkXecGRN6uzYMJEGWXHqvOeYKNYgpgnn9fZ9XKmsyxldm9M0mlQorPVjevh7jkn37MRd2nI8LyL_oZ_57TbwXDDHpIRlpvS7_KTryP9f4RZEIevRs4JErUYQzr81-VZTUbQebJZlLJugTJ6yNT9jYf2oLsDvfnZ1HfZyF2SDSS290T7TCOxSn-WAPjAh8wTjmdoD9EjRuaM0WQyUGivapaaIuXqYqivWvGgn6kerMONdBqcB2yflPn-JVeZViUMbpsz3wCuf7ZfFoZB8OdigeG652LFgP2my29c9bu_81EH7iisyLCKR_v1A0iiG1FarM_l14eYdF95XCJzNbJHwOM-Y7cds_zCi9V9nZV1orbRUpe5khijnRxiZFVEQfsRzkDvC_bPKaEYk-M3Of6NqYG7vGGzMkJHKSf7GztKAu7cBwrchABiNHrAiDocBdJOnHrt9zhs_FexEHzpm_MJJR4aVyMY07ffF0vJRdnTNRgJ6mhaR4NlTFqSO-EQb0Hpjd45GytV1rwYmCprvfGTk0iRdiHO6kWHudooNYfoRblsHYawFNc_HJb3h7gOV-VnjggXKWAPgyT3wkyImDetQthsBX3UpBp48pO3OGxAANeddF3vyhzZRqHaaaoLwejc9KnqnhTaWMQ7_yfbnKVCfIR7w1VDg7QLYfPjArkC7deAAAWCL6VdK50KAUxHYLCMskPuGNma9oSYumd5-qBDNpaBiXQe7wJszVBs4gRzs5aFoAI5Dn-mZqYqc575jCI7U9Ob_e8e41sLotBF1oCW85_r89S6C6K9DLlO5cciU-x36Sjm4Zx7kvCmm_Sh4fMrNoCL4jnUk82jy094SxAYPmve_MniYiUYleB7peIYPdkc95xSs6APLOXuKKFq-f_kNlZZouuwPhVa87JqMWMRMTrpBeS9AZw6rCz1qpcBCfzL8w=w1426-h911?auditContext=prefetch',
    'IPHONE 12 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_Ejx3ezozb-9oDQnCCARMYFigiFsYpsSwHQ2Cv8I4AsEt6SzyXZ53a84u-UcoU8UUgIJDHVAFY-FP2cgZUMTVeTi2jm2vRUoM33qZfJxMNa8diESuvK40Yv2V54gXqtEuS4_BYjBjS1hwaGsJCds1_mx9ScUyi2yzWUZw5Xd-381Vlb1xmLKAm5y3nKU7-fLXduCYRd3_YCwiLhJXwc-v_GkOr8RC6URsLRUUFA1Hw8HEGPeJYy63QYlCGlq7SMSdJHC7IlPsrTyVMPIRIHYoooBy0jYAAKG2IUY6VAQPW1CwZ6lACrj8ddw0HlBaPkIHD0izWI0G9P6BvAvtybIZpMXyk7YYr68zwo8fEYNd0d8Rc_xSKDe_ZsZj33GjGjUeyWJ8SZfjEv3mylz0sXTVoo4oHqSi8-f-2mxFUSUBEciRyoyTnswWpGhiloFKMdx8R1AzIr79CRQcrf78hw3mBGvt4VLEv7MieMeBAoytqtaa-g6J1IysKREyHDSKNqEr4sDrmKEfiLcQkOpCXL6HhNT-EzwUSVeKEOYR7uiyz8drd-2eLjrwp7oZ8tlrE5olBRBHOCoOXfZehJzkN7fHHrRe6gNaBifRWWziIIOHzuUoI_ze3moSL1QYjBYI952G_pI_r5HaW-oCPMuiGd6vk2C2_t0T3GdDriRab9E2wNt1sXMY5hpI6RlKReOorkP_s6tpWRXJCARXUvoFbEQ-xVhlI6KFeOpIPqv-UBtruS_AoCcgrziTXyApvLbuGTbBqexz5gbg_WBPnipH5ZhGA18iydSHKjpFyoDldRgZ8UEoGqx3GhKENlTg6dPGHAH500_88gLaGlh8khhagE1tbQHvGOx6J4UE_aBIOhRRCMLBJi0rHK84jXiCScebsy6e4bDP_quv0yZKSC5rC5bMAbN4I4jBlaXn2lo8SFDX1wq2BW7BuCQZ6AWyhghJvhrO3mIhFUsOW2OE6NLIXkx0ak4XjS3GUWbYhnZjfsKErapWDxZ5UgbvhJDVCny0S7fXmAnsVhpspwzd2nlNJojzLESH4zNLgBBNO-Uo21ZWqcRjWrzciw6ddaoNgH2VBEp2t8TQHHLLpHDzff9ljNFcVFYChy__j185VQ2TaG-IriojMtfHB4Bxh3HXaV487L2pbk5rjJue1rttkAUDWj9rI6FiiLpGWgBeX7Cg=w1426-h911?auditContext=prefetch',
    'IPHONE 12 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_Ejx3ezozb-9oDQnCCARMYFigiFsYpsSwHQ2Cv8I4AsEt6SzyXZ53a84u-UcoU8UUgIJDHVAFY-FP2cgZUMTVeTi2jm2vRUoM33qZfJxMNa8diESuvK40Yv2V54gXqtEuS4_BYjBjS1hwaGsJCds1_mx9ScUyi2yzWUZw5Xd-381Vlb1xmLKAm5y3nKU7-fLXduCYRd3_YCwiLhJXwc-v_GkOr8RC6URsLRUUFA1Hw8HEGPeJYy63QYlCGlq7SMSdJHC7IlPsrTyVMPIRIHYoooBy0jYAAKG2IUY6VAQPW1CwZ6lACrj8ddw0HlBaPkIHD0izWI0G9P6BvAvtybIZpMXyk7YYr68zwo8fEYNd0d8Rc_xSKDe_ZsZj33GjGjUeyWJ8SZfjEv3mylz0sXTVoo4oHqSi8-f-2mxFUSUBEciRyoyTnswWpGhiloFKMdx8R1AzIr79CRQcrf78hw3mBGvt4VLEv7MieMeBAoytqtaa-g6J1IysKREyHDSKNqEr4sDrmKEfiLcQkOpCXL6HhNT-EzwUSVeKEOYR7uiyz8drd-2eLjrwp7oZ8tlrE5olBRBHOCoOXfZehJzkN7fHHrRe6gNaBifRWWziIIOHzuUoI_ze3moSL1QYjBYI952G_pI_r5HaW-oCPMuiGd6vk2C2_t0T3GdDriRab9E2wNt1sXMY5hpI6RlKReOorkP_s6tpWRXJCARXUvoFbEQ-xVhlI6KFeOpIPqv-UBtruS_AoCcgrziTXyApvLbuGTbBqexz5gbg_WBPnipH5ZhGA18iydSHKjpFyoDldRgZ8UEoGqx3GhKENlTg6dPGHAH500_88gLaGlh8khhagE1tbQHvGOx6J4UE_aBIOhRRCMLBJi0rHK84jXiCScebsy6e4bDP_quv0yZKSC5rC5bMAbN4I4jBlaXn2lo8SFDX1wq2BW7BuCQZ6AWyhghJvhrO3mIhFUsOW2OE6NLIXkx0ak4XjS3GUWbYhnZjfsKErapWDxZ5UgbvhJDVCny0S7fXmAnsVhpspwzd2nlNJojzLESH4zNLgBBNO-Uo21ZWqcRjWrzciw6ddaoNgH2VBEp2t8TQHHLLpHDzff9ljNFcVFYChy__j185VQ2TaG-IriojMtfHB4Bxh3HXaV487L2pbk5rjJue1rttkAUDWj9rI6FiiLpGWgBeX7Cg=w1426-h911?auditContext=prefetch',

    'IPHONE 13': 'https://lh3.googleusercontent.com/rd-d/ALs6j_GOxC18BBikuiFg55WPw-XPYuLodp2c8QDelvY0e5djMp4G4sqaHKzplgMzsau4nbdq2xWSckAYVW2deBRJ-f6mWuUaccf2goN7f_uAo_tMGVKXb303zQGlyo5RB4wNWuDPinEQ9m9F0s_87ox7Xj-Ic7S8jzGrUfl4ITDZEm2Jgls0x_lkJqN-l_fLX6aacYqyYPtVkqMSR2NqnErXJUVomYCP2Tn2u7Pu-qu7c1VjGDCdypXgp5jW3L-j918vlM3GPXrkCboX--G9dpFjpRfOqH3yOD3TR9yTm-Gh_wobcnfIm7YlhavRDdpN9YjFECjXrAMW31vaMFQwPyAELpgmQKd9T3hYvzUDXrgPyACRpUHgJpkTuckl1nv4g5-bK-tKtAJpnrGup-bcGcwbDxjn11VRV1knZnHX0zmcuyRFPzFM5qrXEH6l78s_n9T7s4Us7c6AgCpU1hZKS59UsBHwX3vKvB3QRSEtIoaTVs8VGelxh7MFShOf83BKxezoJlUZmVGdw5sazAQWLf7GR2Zyn6BHmoUxEYiZIuPUxp7bHpgCakPCKcvO6bQVQGQpXahgGoSuxHHGxZVq-8APMt6C5Y3t51JWXBwWAUu53IpbvOrRIZauMJAIriOF8n6UqACdIuVDn9P4u0J3ZF-wDuQCsDnFPVRWBA9SDMTxj6FWstauBA-s5V9NNtGPOZwCecIN5UjmsbmbciVp4GfbxQkxGfsjybR5kyJiBbKCMNtLIOtWCTyRwyhMwr_YKEolhWjJdPxo2bNnqfI1mJkSM_HVeX9le-i-Jys4NfbP3cU6OELe0sk0-oIlvo1DOttcv8LRJCVsRMJ1ulP5l5Av9aOEsQHaP2RNafFjYP1DHVRauuBnP697ipuB66QA1Wac4DtJwSCIM9hufgnLGt-Z6ddwqPaLyftZT0Q9VKlM4PdLdwHUK29q9m0M721HMIDDcRMvDz0Gw1DhVSJYhbm5pmk1zW51DfToSboS3WUOtGkxmGO6zB2rNeuB2HA6JKvbVs8ef7A26_q4MavDX3EderepoWeLQ0avcZ-PA3xUiOb7UR7yRSc80Bt8XAhyD30kLikZO8niT-mdjsR-loOsc4Qz3IB6i5Fp9EtHJo2orclvJc2-W2Ur5TANuEwucclhtKyHFWH-m7C2Ehgutzf5hJsTjMqrCed7OaFG-g=w1426-h911?auditContext=prefetch',
    'IPHONE 13 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_H-HI6FghF24R-Qt9avcgm9B-9-Q86RowbvQjyWmxZBOA4e1OZjGDz-9pZhjhpZD-1wHQ8zs4nZ77idQLVc35kmP-OiXQHUJPvv0TgTBvkgBRHVYY7uho-toOT0HmgkT_4O_glyo22ave0hQPEcYYbFafA7BEnx1v_xdQ4qZEkUTwmcRcZ9HQsrdij-0GukUR32g16P5lUy_J5SvFiZ-YTtJ3HBkgvgW56yp2gFgo_9FMamekmbOE6lJmG-uPpU3hQBkvFmPdZpgbpA0c2mwoMGb8caJ0qG6dJhluF1Iuh8AhfHb33L8UR1x6QQmirWhP7PojD2g-z3FVmG8ztWgF26jdi_rwLK_J8TfN75hbQ5YZUsAcgBz71RQfXmHpxetel4Te0xeaXWThUKENczxrkUKEjV2XjeLDfEVCZuipCg2nEhFKcN98gPeNsDTzQqejSiuQ3tpmRa5hrfPRSB1n4UqANWU-mRjIcZoEBuNQlZvPlXxWHmGuFFZmmxELr9KGxEORdjDoVyWbCVwYHvBzRGD-K7De3pV_aDA1WBaiHQ2z8_4iVM_eSqzaEnPxAU4Nm0v6Wkz3rVdSH2yOvvyXokaon0rGV5AMink-8aPjYp13cU8iIhHTryg4l137ChjQhy9JlMrw8ANxFxUhwzhAiGjpJXNndDinWOx6JS9rFEdHK_Aa___tpcAdd0RAyqdN1tGeOnyBCuwGVxiqddmQOfqZMGpeE645yVQcoGs_3I55AxlbivilEiJf4pnla4nzyz3iVN3VRwcoE5-02loZJMtMn-xH-qHeCJgg7bj9_muUWTWmmiXzQb7eesjT1_BUq8QFRVdxtA2SJ74nD-ZlRtLDITco3nMwkLfxHLwvfxv3lH1fIkAkPUBR45UM-3-YRDddbX7qBf3UYr4OGA-0fusRsofr3-NQLLMGNmh603GfVx7XJzPtYtwON9JU59PVBT9O56lX1HAvzwr2UK3iAIDZQ1YgckAx-k44a9hw6tqh3NPp-Px3cCTKRaRifKptMbwrsnwlvvP7PkAxFydJbXvD6f-PqvLF3PETdkna--LIL5xcqB90LiijzoRizGYDnv1j53CI_uSfG2kslbVegI6CUs2glSpBJyYI-4iM4KWqVq6GRMdYMZPEvvyCNBjhDmVU1BlCd7zHAEil3NHWpd2xLeGxY89_bPqg=w1426-h911?auditContext=prefetch',
    'IPHONE 13 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_H-HI6FghF24R-Qt9avcgm9B-9-Q86RowbvQjyWmxZBOA4e1OZjGDz-9pZhjhpZD-1wHQ8zs4nZ77idQLVc35kmP-OiXQHUJPvv0TgTBvkgBRHVYY7uho-toOT0HmgkT_4O_glyo22ave0hQPEcYYbFafA7BEnx1v_xdQ4qZEkUTwmcRcZ9HQsrdij-0GukUR32g16P5lUy_J5SvFiZ-YTtJ3HBkgvgW56yp2gFgo_9FMamekmbOE6lJmG-uPpU3hQBkvFmPdZpgbpA0c2mwoMGb8caJ0qG6dJhluF1Iuh8AhfHb33L8UR1x6QQmirWhP7PojD2g-z3FVmG8ztWgF26jdi_rwLK_J8TfN75hbQ5YZUsAcgBz71RQfXmHpxetel4Te0xeaXWThUKENczxrkUKEjV2XjeLDfEVCZuipCg2nEhFKcN98gPeNsDTzQqejSiuQ3tpmRa5hrfPRSB1n4UqANWU-mRjIcZoEBuNQlZvPlXxWHmGuFFZmmxELr9KGxEORdjDoVyWbCVwYHvBzRGD-K7De3pV_aDA1WBaiHQ2z8_4iVM_eSqzaEnPxAU4Nm0v6Wkz3rVdSH2yOvvyXokaon0rGV5AMink-8aPjYp13cU8iIhHTryg4l137ChjQhy9JlMrw8ANxFxUhwzhAiGjpJXNndDinWOx6JS9rFEdHK_Aa___tpcAdd0RAyqdN1tGeOnyBCuwGVxiqddmQOfqZMGpeE645yVQcoGs_3I55AxlbivilEiJf4pnla4nzyz3iVN3VRwcoE5-02loZJMtMn-xH-qHeCJgg7bj9_muUWTWmmiXzQb7eesjT1_BUq8QFRVdxtA2SJ74nD-ZlRtLDITco3nMwkLfxHLwvfxv3lH1fIkAkPUBR45UM-3-YRDddbX7qBf3UYr4OGA-0fusRsofr3-NQLLMGNmh603GfVx7XJzPtYtwON9JU59PVBT9O56lX1HAvzwr2UK3iAIDZQ1YgckAx-k44a9hw6tqh3NPp-Px3cCTKRaRifKptMbwrsnwlvvP7PkAxFydJbXvD6f-PqvLF3PETdkna--LIL5xcqB90LiijzoRizGYDnv1j53CI_uSfG2kslbVegI6CUs2glSpBJyYI-4iM4KWqVq6GRMdYMZPEvvyCNBjhDmVU1BlCd7zHAEil3NHWpd2xLeGxY89_bPqg=w1426-h911?auditContext=prefetch',

    'IPHONE 14': 'https://lh3.googleusercontent.com/rd-d/ALs6j_Fo3IwGcAw1GNXcl4mZkhpA5-sNaxXM-WxdhmhhTWMNwvlykiKlNrgxhn2-WyOSXuvaQHG7ss_E1qY2WEYQ6DDtZ8s9qqIGG8dvrlvdz-pjyA0-D3hXTJn_UZ9O40uNLw0VmzYsjdYTlCnsTy6yew6SkNh3FxAPQykDuKoI8Uxgw7YusVuASTTIcc6PdpF6JYwls9yr8AnEJT4jjiz3DGOiKJ0sGaGTMSyr4enijW6AnP-IT3swcOG16qJTYLZSLgpzN6UE8U2hq-e1O5Waib1RuFWq2xQXVA7lSagLMF8UaxiHuBMWT75KBURAwypjrvqjljSIdLK3OuGS4inRwtbkXh9xYMalsUoYLGIifglpA2TaSZ6_D2GZScIr711qGKZ0q5t1_084uGmvfcPCUegZuwKxs8xw797nRXs7lVD11d_dDIletKsJeyGBNZXjP24_rbOfuNZayXX3yifvIgJq7x3dt-rJP_GUAOLBRD-xPDW89CSp_tbfB7aiz8KexQCvkJ0pXcNJfr5_YdfTRx9Tha_8SjzgesUqULh5BVJQUgc92Rc-ueoDPHBpDZw8lSZ0rOAoZ--2fm0gYzHdVu5lQ3073774-RsuFCTqI8uW9IPl3PliCEpIrbn9IFv77La9UlJecpxuly6PwVGPZxk-D5mzUv-UPx53d8G5wPVZnuo5da2Wq_4Div-DtHm2edXqn7Z5Vu93QBHlhVsVk_kv1tKBOiognhg75AWqLPzYmPYggIg3TIbP0bz3wEwCsgyW7vhnNJuctmbzwkMFnJhX342Z07RrDA_UKUYBCDoWFYbXCIgIpKgler3zLSIXq1NJYmEa6ze6ArsT3EAnMTG_6WE7qQtgKELkIR6204mvSUo077SFOBWIP4CgOW5gwe_mYlHe2eCxerDNsdBBvLCkkuUkT-F9GYsEv_wZdVl0HBww14_Bhca7lAgL-xrZIWSLYTGTzxqa8dQh8lVSJS3YVArQxvizlTCf6qjcs5wU4uhoLXrbiMeMNpwOCtCEFS3A2ESNRynNIGpthAaZFv4eGiPc6jqThHY-oxYGNGe9_srgxaW33zSzXFH82Q1l4egJ7kKKgmKRzSIRji-aE1c-TMpBzthBYj3yA1WxOZJXn99VwFnnbFeS3uzKH18YXvY=w1920-h919?auditContext=prefetch',
    'IPHONE 14 PLUS': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HTudcUCUXzr7y9JrPV9DZC8vlGIC8sulfZUszktDwvXZQtT-sNNSp6Dni1kgRcTtshl-8PS_0dRHZMdDkH7erxI_HCgf6K0jlym93KXTW3eTD250nUmqrwbvTwniGERddVisFb3fDFJG519YrDyJ6DgVvPcoh-zEoH49fxrRXXrtBYWpHYAGoowaCAxr69h440OaPSZk_aiZIkV3Fe9Jk99q_kq7RQ8mTeTCvoCtrYyaiNdPtElEbYY-PiFpM3S12OaTCV-mipxspvWvnC0_q6RdTTTgl10Vu9AeeLcOo5P-cUeYga1fP-t6I95Mbvu-HAYIs_dd6PD0GUye46nEnHUI9AZcAiu3yms1VJd1nHej9j_zW_WFmOuITNYCF3afL4N1GLlQKyWRP30IjrxuKXakuIYJWiNjcrtpA13blALupv2X5OardgEjwl-QpW_S5BpeV5jXFLD0lmh5VftTrFsrytSmzZqis3OsOn_5y1_uOYLNSmMb-Mcix2t3X_bMjkJt_ierUbPCc8qFgUaiRSEobMUBdx4BYLDbxKYL9AZy2214Hi73oMectbggZzm5MtCZipcBkf2oYZ1SQC3eLdgYwwsuoRpu8J-_vwsYABd8HJN8AkhUR3VklJwCn3J6KNuf5j9SeRh2W7pcApPktibi-3hHcfAKWvlZmn10rWatVUOyKCMk7T1PrBhsZmQNSRdhDUOehoslEBWDYnnms1BRldeOj-in5KeeJgmsOjLS0fhSQxS_Uft3tudsecfWdf-22-JJp2hESxuXFTyHNisK6U9rOtxB98ibJRaMLNfea_9tIefOoaOlGLWnX0RQ6lhpuX3r5ed3eJp1aCUWnh9Sqs62czSvzxcAQ3SRGbHRygkRm_3yE6P7XwK5IDSlfsFectKEbwaPfhoxvNmyo_UhzOveJuE3qU4gYtqFlSlwAlS40bfTVmqci3JZZEBxx4Km2SF_RSR-SgOJWoxbBIDmV2fRg1vVFJTUtDUKmpsBaGcxhsn-_Xbl5DzkSv021MBmJPXAc3OET2wcNYvw8xBdIz9lBc6BoKErqeV2QuMh8am5ENp3sCndn02oIZdxeL2guXEBFBlZ8WWMhzyxeIQLhB1-crhJMqF29fiLLu2f1KTHpYeqL53gbWtQew15I=w1920-h919?auditContext=prefetch',
    'IPHONE 14 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HvcZkbc77wHXGx9kHKWYnlC6iv4ZZzVQGAB3TFH1irUf9kIqdbzK6468TAEeAi4x-zgx4acktgEPYkt5zA9T0vtq82vLHz8uZR3i3Gw6YtXpLG5C7eFBGa0o6wiIBYDw_6uOUkEU4kW5L8ufa3Q0AbXwJE0W6O6hbogwpYMLq82gd90EvqlGspf9ReGwwrsI7AjG-aDfS6X0yeI0j1liCVa11qyzQoik2mnjsFgCsdC04PN2zuWl-lVF131oH0RL2qyMIi_ZXJLVHJV0mFOHYhu3LbJEb2GwaoPHAeRLR-Kkco4FdtkDXOnq1p3XGnFei1grdINwM2ebk-E-V8KR5bW5je-oXZspwVScmVrR3vPynhRQB6RrlNCkmt-vV5NtZ5P0gvdJ0e_oQUY8jvCIHp8h2be6tydNWcq0iSEtUvbYI1cp5xc4nmtIc1VskVu3ic9PqVQ8SHbEQPaiP7YXaY8rzvDkUePuYAJmvV_v5Gy4uNYEhrKjA8D14w1d-OE_t2bf7JU5_QMb_P5yvq6AfpX4rbQopOhm-PGyBY_CpBfRUEgc-nOhyNU4qmkxdFyfpzOw1kG-CDCayKNhlpKkTfuCHLCvJHJeC9QkKf-oe09D4dsJMHanEUiRN_9ve51PJVfotOPTUnsGq2Owy_16UuX2lwjfO48v6YMZHGa9C8lJoP5u0MbdGDQufUILzClp2GV1j5N4cBBUXCQBk0sb8XU7WOR4WLzJpHJISnJmRuaZZg_jim1KlNUeulc6VXsfb1V8p0LnoolMrhacT1aEZKBcx9NSohB2d9Q8GlVyGOKZlPReMry6sN10y9rmE-9lQFdZThtZpzMPfLlQ1q7CGJbY8b_EOcPsOYvfKI6QK8rHYBXRy8oYze3F-96UAmZ1U6eQRLB6XrVWqstGZ_H_ufLxC8EvgTOzII3s7-ck6n7xPvNSoDOTbmi9g13GCJeJ3OFQVU_CFUQp1UiHBZhLy7yuLm58Ek94nxDmY9xTOGYY-41GZ8Fcr2Q8c3kb4vac-bK2ZaXeCZiSx9OyeUK6HhvQ9JoSi4F9UWUybwsHazr4jI_NRUXUbZV4JzhqYI0iAlfldf2nSDSyYGi0MNPXVW2nWJvoCIPD3-PlC74yY7qNsJKItcAgaYBYdV7InKww=w664-h599?auditContext=prefetch',
    'IPHONE 14 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_F8YHWwEff-vPVOPzPhuTHUR3IOnuhpzXsJm_VKdHPwZ5VEb-PTctN-5r4pI08af9sRfOSEDGxWqS1BMGJllePoMth0b5zaBgp3sU0xH-eZSbqP1zrqXEPERjTHaAHhQR0RNy9s6PvFv40g1T91h_HgW7gyigCUSnuI0P3_7NHG_81v3OekCqrTLH-THn7ZHVXMqYFdH0BGrWpsnssSVGszxS_dqCxEhQagnZZ3f9BxoAT1Bt2RWaaPTm3aXccoZ08NuTkl22vlFlm8XrPqfvm-ZiGpyLa0hrJEt_jBbVXYGqu4Om9doFhx9K6td3rP7fbI--Lvz7LQX3AfEgqO6J3FvLBSdwPZfDffyqaR5N7obX7jKa3p_U3rFAFBv7z5xX7SHfTJTz72AKYpvl2pZjIW--FG_xNNIxOpzzs1Xo0St9xsPlz9AHQdfN5dIf7REK0ikWwS-0EpHx8ELGx5CsjX1iqw5eBQVy4OHsyZUqC7OVhw9xIMAiVMQqbZnHaZusVNnWlSJSPyTu-ceky4rZePjPDyxIj4Xl07Ks6hmICHkskmyBDBDn8hl1lISLPTOzWYoa72l1e8fNBgDeOnbAu0GQU2aRFH0DX4OeXP2hOHBFUa6RI1stxPCF27ooIMWdmcZNQbwthtsEAjRzVSeEATvmsWavyAvGdhIXZy4NH5lvfBUSD1q7-XvjtIkGXwSl8lV8O895z53sNoZdt5AxMMkQMsF5EjQUEMl3Fkmj-we23lGzUp6s-MG7bkfkWZylzCDTt0S1VKJZP6Q1NyicJVMjnmUQo-i0hWq6wwK1NK80Rjs5OYYzVcIYNx1qOXyruXS3aMPDFgUFoeInAMczJG1RXQubKWG1eJvxEp94Ei3-vlahG7pGNO2fATR_RS9KlvUIXXf_2DDOz_u2S5SEeS6xUzxt_cyGXBYeqEFvSECO7I1MIn6uuxF-_JlpKYUd5Hjj7emfh6-jOr94y3CPCOUbxL5NJIkj_7EC5eWIuNGYy7yIGcGTShUK05ASAC9l0LlUMUdwrklsow57pFCFuuj3Dlx-DagkebXJRkXYC5wS3JBzYDa7TCCVEust5-no2kOu8bMfIYCJZyo_dXego_sj-JoSXmr2zHD7W3DE-4gNHIewbj9PBGtB5tYH6vcoE=w1125-h599?auditContext=prefetch',

    'IPHONE 15': 'https://lh3.googleusercontent.com/rd-d/ALs6j_FqEc5JyIXw7QpQFSAspOJQsAq8_Q9RHBkGsnRqg6rjTFvu5EGeOdb-SBVGzumXhOWXF-HLbAdp-e8ngiGlas0k0jjYGEDdm2il45FOPq8AQyCxCmekiIfDqPQIqtvHfJ3wkBQkxfXp1I8o9LVyMqOJzvZKj29VUwiyhOuDhtaMFP_yMBXfdqB42zu58zHfOKXFopl0Kj4HcUYLm5rOPr86Iqqs2SmSuvwk9cfZ5pDd1ngeVamGk9UPMaG6QJ8Wjjb_TfZWolC7W531uMYLTQSeeHYWVmsNMsg5S1k-um-moJqQqgKQ19u6ItM18OYwX1H2G4RaDXOXnGLgPlpAvFKHLkzpsmjktm23sGQu62plvgSZ1Yf-QpfXi6htN_l3UrD_6Dgwmk4COJJ7atc9o0DjQGbqRrP2BcCzpOEUidioFIrS9IRBBQJWy1xXE5vpKa21hlzTc67iSmTEaoVn3E1Swha1me-qVNEDgt2PsZRTitAIoo3MUOGj1zx1v9Z4nQDqvW33E5w4oywaf-_KQ48kVXnPt2yRjd3TWR0OgMjn0Rr9ANfaWrQ-f9L9OE-62L3MdN8jKwq65YvPK3TiulrfxNEQYPbPFZvxzyWyGiSJiq9eObZ9ZBCMWSnNXokJETrcJUYYmWFrFVvbdOGhjEak2vIxfKMU7_eu_0qydu_2vIT9AHdD0PPPCvj51oXhYTW-uWzNdtZmwCf9aTN4D-_0jUMKTwx5Pw-RKVZwcO075sIDVdDxnRCKYdSjHGaGtTQInK---DdLIo6JiV6gZJ0p-_V7Gj-AMSNyRFCx6bmDM8CbXhaF5O57LHvKuu-tr758jnXZBVVgCVpFLljwe6uzuluRUsE-oUAzVqanEW9ahWwZwFJej4D_vKzdzmtdl10m3tBhxCw_THvwt9OYzCg3Xm2xzoVRBaGn_1yi7EASm7nRAsZK0Wn8xssbrAbKm6tZAuxYS4qCoGc6sTWqFMgTOVZ0jsW0tOmt4ykjfV3dsKLqwPDofLRDP3liQq490wfFpylqYZ6tA0FKAeRA7vYspbeGT1s3pu_1chsI7Jllsr3iyCd79xO1wbS_Olqc6WRQMMlTtzYowf1RdgFFKcEP4HYDGpvgdVtaZooNP62_zLbOj0u2X1gOdmalvt99_vc=w1125-h599?auditContext=prefetch',
    'IPHONE 15 PLUS': 'https://lh3.googleusercontent.com/rd-d/ALs6j_FLcL-CXDDkIOG3aa4sdFhU94wbd-LlrO0D_kV-JqQni6mg8SSy_ET21EHTQvgquMjeWW5D3DLNsw-T-RanSekfHnP8Krbm4iBrI3EOsBnoYvT_C9AM8HYx8v7HHHnliSoe0J28ds_7yfUA_Zm9i-Y8PRRpuYq1LFCOHYXt2rN5sN7oA0VxOM9vViXuI3BqxlTHiuJ6gVOAXqStdeicEOitv3WjLIHjBQF3IoEWplrSmgTGsMfo_L9-pFrRDVELj9vCKDcP_1AV3WrAl3uPHUsrgVvJuyqYlvijcGTPocuRxahrNGTbnBkv4WWCnEf5iUtRNuYVZtF-533lLYzHoaCu-ZjROZGaulJLoVOlfnKl_fWKVNmsvZev7L7damrPSEIC6n6ZW5wl5u9nKgaNx953iwa1VtQa30rtOMcnFHiHlFVI3zM9ZVgDUOBkdmM644k0VductQyQmuJy1wTtqM4x6Smj5Fc_27tfyHOG8AKA8o1nhwbBXwiNyHXYaTzvnb4b0aiG4DXkTYYr0SyD5I14nhgerj2XtVi8m4w4Q7hOoG8CnibDKDUNBM7yLNiNkA-K9o-3yORiMcSFHRcELxOaycTKd9hDumpzF81jjou0_fOtC371MCm-zbtv794l3nqCiOTGAxz5QJ3eVQ4oGvsBC0zyL1STyZZw-LzqnND-6I-jZ3HJat81g4t96rTtc0HBChTWjjtY6RfcWg63EHfMkY4WzV3uDh7rTtxNTO98bm-ooEdAxgamp6BpR0a6vXUERvvSGJ_VJZaJ6Ugsd4jOj3yfrlggj6Bn1H3aMVjZciCi85ELvuVDINrkHp8QoSfxLK-Ei72R7VCHvx64saXmdiH0tGo341wXIRPE3J3UCSBRw5rjZk1-vDE5_LBRrNl8rFpaNM_SuZ02sPdDG5NQ2qB6IDYXw0DFfEgkZk8c2mZmmi5pGVAj0A9KndKNL8XjANeGdy_ahr8zuZCkaD_NolSkNowpmq4FtweTiq4lclsFWrplTPzAD19G79iaDIRY4tbT_f-XKYeIHpIcTL8Svl2dUrqXLQBQ27yKowOfOi3mXQbZ0XhZdbfIVI0LWk62DbgezHL5dMVjuhJxUre4yHfOYvS8ojzqeO-jrdH-HhG6-hx05Qobja38fGqJKRk=w1125-h599?auditContext=prefetch',
    'IPHONE 15 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HDzl8EvO-0XEbB146sF3K0w1Lty3sW2dBEQHH9_n4ARf0Ri-sss9Iw1IZ3khRPwLZ6uy2M-mOCONd8GE_r6_vOFXZjDp18bPLE6ZREQl0BH1cdCuqTUV70pRIf2ut-cmJsmWrIiFza2URjs-oLuSMyiGru5YeyCiqlnmtzwlgJqwn75IzTmObJpY6AbeUnWgqAgFoNiETB23FuMuhQPCMLgTnOiCqccnpCLsAP-hADthreE_pULnNrTuobgZg8sstVpUIjsWPNm3SBiJHhPxlO4SkcI4ccGp55cP5QwIP8tUcOO26OOTwx1CACyNbbw2nu005Nzg3qbv4T0qv9qzQO3qbXmL6QIigNypjBljxOJN85BAjvEDK6icg3Fo_ZS7UcGmCRE5Tp0FTKffQy-Q3FqRmKz-sa1_vqXcpEcLENEa_TNPjYAVrPRxydzyG6srYv7-fmafpuIj67JZjcy6UPaTTZrajTusuo13cAX708K0TaTxks440UWzqaIDvNyGQir9TinYWadVwYaVBwbwJx9EHjtklGWNfcDzItY9aEcvrEUrgxY2c7iMDtXONWauDeNKIFMqCRITEbAwCCwAlo7VAFgHNOxF48OUV9kP_cPTPPeohTcmjbO1vQszE_Fm9FZ2FpXuYjS_W6t4xFXj4JPXLsmh9BEbnXHjb__jOwDI3aMJ_BW7CYnPx3AEZJ2bYtUPnXACz1MoTTqTJ2Ds6GMXFY1tSxv8w2X5YJDOQb2LcWLpl8L5qUbUtqzD_SFdGyDdUhc9yFLaspWPgcJxpUwCMtof-n4mwsmhFrTOxztOzSc8wbWP6_odbUp__9ASJUTkkn0tOOfCijQzwj4yjCWzfSYi2ou2EBpO5q5XDol3ISvLM4SK-RmtvR2hMjbgxxJoVHjRNHTsbpGDJIRLaaj_MhTSZJvjies2Ek1kHaIEQ4saZwcr9XKYhkswi1tEAKSu_vgi1OWbLp_V8qIpkqpyc-IYGo9T4FJdvIJa7XkQpruR5Ud1Q6zKpqWs-dBzaMzPVP1FiOZN17OxpNy6f_AR2yioCRHrSoUlPrDZj_tqkTP8Nh52ur4t5w8C-zgc1Ts8nvSZ2apfUbuvzKsY0mVYGncLiXH0IU0FCXB5ImgQw6fXsJvkLCcEXT2Vru1Xc=w1125-h599?auditContext=prefetch',
    'IPHONE 15 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HLXA6FN7SF_2zwi7FkIBwHpHFzxJtU25nMmZsuBqlpO0NbEXWVbWtNf9UssUru9CoK7lSos8YPW1tBBfBXLRVeOyEKv674wAyRS-_aXnZDqn26-4crv_9XNCSCB206kYV6DNyJr_PhP3mYgcvS4ovn9PbWhrc1_mDcKQValD-8qHX02oN3pBvgRfgcBEsqsvCGrDo9vGlhzIIHO8dINKLqfvFLpwre8akDzqxkzuGHjcivKy1dGGPJwH3mx0z22uY9JqDXDjWY7uruaQ6Uj7Y1_Hgw-0xABcP2nV8mPCNn4pKxdKHIpuTi8kq1pYpanTfooMAS5yU_o_2n_zY-YjWBGBkhqgZLI1yloZ47YRKvc1VwDI_vccWXUhIbTUWT3em97uf-SS2JYrVukUWL1QbZ8TV3vOevGjUqULKX_Ozq4YMl-dVCEPqGvdrbaoQgi3o3sbwCQhJiFDEPx6wKVjsnqiKIgxaOuup0VQmNBzSV07BzM0LGDbs6AJ1cUrC3UCv8imjUovXc5tzYHQom3g4TMg8FKm9rlj3rAjaQEUefgNoDB_QmXVyyTuf9DijxqgAZy73ZFPw17IqqOfHtyqc6DT-3qng1lrPX7dltIDx4ZSTfltNgOY5UAt493n0-gIi7HytaVSV8-eBCrH7kkQ5nw4btYPjHHNi0DLNlpSaa4JzcEddRxCQZBYIO4-jQy73gD8i9w2dNTi8elNVbjKGjD0zQEtXpyhSGTG4vtg4N-4lv9X_8GTHp7a2kX74mCB46t4d_OG19Y9_Fm0wv5VY6C1CNlMyW76IxkXSpedVhALVxzcA-yWAoyjU-fHO3N8WLqWV586JyTu12aDjyg1hHbvHtbpHzO-EiC6144BzUxqPbusf5E6OIse3ESBQI1EivyUz_9gICs6k2kshOYnv2s17m2JQBm8CyYp9RPS4tpZZTQNqy2b2a_BT_xUo87AsXLp8s-F0nVyBf6ZS_J_YesFn-AQ1g6qhZTJx832Bi5P__KctKyQd3ECelkcO62w8Fp94BdQ2EkgphcliDV6G5ujyi7L2jxSAk0r8IJOm9Az26wwmimCWJRoc3SIbVg10m-rTMCJvje4ajbOI1H08IxvL4eD-SYzFSLHcInsLlZrwmfB25w9vMXONUgplaLaA=w1125-h599?auditContext=prefetch',

    'IPHONE 16': 'https://lh3.googleusercontent.com/rd-d/ALs6j_Hsmw0H8ChFaZklx_3KDSvrwyt6hH_3gDStpSwcn8OiTyseK2wwHGc-cuTtFav2Mh3PbG4qbpmrig3yDs-ybY1BozZs76K2MBdE4h_flzh4VtNoDXfInm5SEBLxAbDQEsq-72o0BlyMHeXr6oTMYswB3kezqCpKoWaNSv_T6oDze0Awb6sc5VKDi-tCvoyXZl1OrjpX0f0XtAsVTeXYKkhNhYwJWLmwdJOaJduVQK5-khnOi_CiH7exnKGuT80bA53E7iHq3_aiG658u-gVblW0RBg63nL3tYe9dlkfOceifpcaq8geCyYTL1B4RxiUWMRXUwxmhr8wEBx5NOhtEhFHoN7pQhy-U8S7aEJvsUYWnEnmJTsZ5kjHooZVEuQv0fVRQfpcJIBqxitWmouSRplOkhOPTbUL6Tkp-ICxTMMVxKOjtACXKyZNaC0vdKbRmOkG3WHxyH4949Bl5O398NEPb-1dRU9tykOhFqbI6L5E_D0j6_YEUs8qbxyLMpR6k3BiVtZh-X3ocshNqQDF_5ZEsC3PREYZS-grAOwwtw3quXjYMToXiLHIMfgsULdEK_fct2EjZ8KCBN5lNqtX4YSdN0UQYAFpV3rAElL85UmVhUPSFRh-nTFFKv7NHOLogat6eLyJouDVVo2jfwPEbZK218zfkfBnSG8a085mZGWLCh7lemvNa3irxkoXlMXJtrntxuoxJ3iCFQv9sFAWfJ1ED_XdN9fH1YX2odTbXV2Gw0hLGC3D35pSsB0xTRCc7v2NesYKrJ-ogNqmuXIYUU3h-ulScLoJqBfrUOquOLOpIM3g3GOqANLTEUvsGfTUSk6V8soR5W0Ak6u8Wwclmx2MpU9BmbU_thUP4SRor1VRXbx_0yJoW_tZ2EJPPBqq7DSp5Sv6nIwGpEy4MNn_6AzuDxKD6MRmWFocXIf-yRHtkzu34GxmKa4l3tLN4_DFdSm3vhV_rkFMtUh3kwoFwjG5JdoK6RhLgKwwscJb4pvxnNlZqa_9gqZTcyaqu0AC-9k41bPA_mCKSPKSpitqthrcWiS5gAEjJDHh3ADBtX4nDv7E_r6aifpiVRFz-v6_zcN6A8g_GA1mbf_4jq9lyPmIU-t-nB3gSEz1aFNVf6Ptasw20fS-D8Lked_-wmX14g=w1125-h599?auditContext=prefetch',
    'IPHONE 16 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_Grr1trIUadw7qolgx3HWoks-ITjMSsHI68QxDkNJqe7qa5YH57l6U-hb05NEhWKNEnUums745JFVsNY70UjVMSHT6CDkbbcejbVzw8hivXI3-Wn799MRxSpDU1C-JrbhlMb3UGH6eNi3cKCZmlw6UA0vLTVWazFDKKQWGQyIpzMv8lyk22XNqRVu0-bN-IRte5jxouRUuEcJSdboMTw2_Ke9KK7bfQ2J6VKa1hroT-mFYNdnpOcrcEdhlZLldQiUHroRUvoNQJ3CdX_kOd0tf5gLmOGPIU8VNnYSi6cZmrlSNI1KlqXqFRobEbR3A4WA4MiqpEb-jZbmv8wRqiibTArflrJGhUp9Q6lSiYJjRT-RU5Ij2SiYNp8s2eypM9MRS5QGEus4rDLbpr3ebv9BeghIXCaqL3Hjg_YR8lZAUq_nt5a5XoObrv8xZAJnGqGMKZuuoZ4-EsQH9RihVfg4VH5h374FTOzAq6kYRRKs9FodMAtm4G3vbr_ZT-0vgnGjI_i2pAy5EKvMRSxDRRTytcPlpDIh2PCreY3hLpWDgjy_Ga15eGfxPAoVFSidh3QXOcbFlNGQZWmOT3RY9m-MJ-b6QvhP4MsbLIhVq_qKq-o6qa2JADCMoqn1IHwPAjFiE8mdl0jChIXNtb35kHdtiJPWS0RFCzeo9TSQninEpMeAUi-t42050ccZ_USMO0ua8auaZWAzKYuxj-nMTS-GUifz0MPrZI_d1jqXZwnxCojiXkzz_tW77hQppklmMLCASA5RXavndp7gVLWePlOHfoKU3zOnM8QwPAX6kwoDOT6Mb-dKJS2O8MHtuaFyQZFdr_dKNc0pU6SzSvCRha6xP5_2007l_QDaIvJG5Wyde5dUjM6wnSrpE7nY142_ois6BFtaARVANQ_N2JNYVs_A4CY2Hmapti6FE8jVtq1w4OoKpD1vfmn7pacVHVd-7ZIi1SrlWOGaxigrOJ2JKqgs6Wa2u-n3DR1KChuxZXEJfS6FPExEwWQczU_b2UgoWE0414wocjhNx8pw2IKS5m5SlSTu-7j41mPtHK2zNXayF01eV4J_wdkwMFuO-VrNAPomcP9Gt6Kd5k3mY4Ipx7scbnZuFLJi2ow-VXlMDj0VrnH5qYKGduQzqM2oKmT2-rZA=w1125-h599?auditContext=prefetch',
    'IPHONE 16 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HYo3rqIaTEKULFZeXpunErcdo1eCbjAJ7mPRL68WRLUmX46vP-BjIOj348bRlqecS0hcLeOsHGSKzZWjxD9GsJo0SDs8D9IyZTQMYITwb_QRazWj42HiyK1E4Is-m2Vmc_sK7YTp26pQOJrgJiXjlX7CKlzsVLZoaMas2Sw_Ftr-zqte4o5Vy1v0POkO5S3GQDnQMhqqDT6y2uPHQNEEWa0XcBdmaAqh1jB3uxHBd79xqEEOcA9LMm0ZbJ1hhW8KxepVhCVTzIB0ApK7c3WwA52N8EVMVFc9f6sTbOgRWO-Vu9Ma46WShpW7d0-rA4BWdmqeaside6It6-dz66pv3XmYPx1niqGaIjF4ParFoY6P812qYS24vpp6bOEXRrjG3u9GkxK8_VySvB9Hz6ClYpdzcHM4he-Cqfs8dW39BsZcNAGBoNockNzvSR57aHH-eF4dRYz483SPtwLHzFbqBv3sOUTsHv-gu6mntW5LJY1nkPoJ6b9aRzogL-EGrbj1l6PJJBO8_-0-N0P5wA3T0lswde-oKKcE3qFV-mUOf4OnPgSi3tBBKWu1cJteG3gUQbxC_fre7mOQ_4_aHTMCdoLDjn_dNlTvKC3FCH_HGLYjSX8Rs852K4Qp7Vs7XS1pRkP-KlxvBaO9H2LZEFEJ8PlPpjfwq7c0zFkMsCXHjTfkpei50efKLjjgPUa2pLsjrgBkbi3tP9L_heMJOfrilyGaHjI_p3MmoVN-scrCwIm5edQChLHO8rMMfJfdu1tuACs9SF2v_fjt84jDueNWLz43VYXhueYmeR8Fs60e58P7YciCkO-v2_e0CSwZj0HzabxyTVpnyGTwGzw6wxujX3F-BkUNvx6iqlc3rU4exFznMviiwLXdAN_nVKx4ZEMQ-RQRPIe_noSjCnHnwWQjCKFQpN4Cycr1239qlCq4hnTMwxvIg-N2x09J5o3Q1fZ8EDk_a7fBfaVyF5OKqtQR1SSzdw2mjnM7PEKOfZ8xpD7L95KR502ZEkyUtLQ5wscST6ieseeCsVcZTdCRMHGJpC-_RlpJNNeDBLeJNU4wVhQMYx-zYdubDmUEbfo3xR5VcTtSdBNBWWrQbZDlzRm1ZCACTpviQo3BWzv_EBDCL9RsJ0KnLMuH2SUzlJ1WA3-Fw=w1125-h599?auditContext=prefetch',

    'IPHONE 17': 'https://lh3.googleusercontent.com/rd-d/ALs6j_EkB_5p1DFx5y1xm7TV1XvpISRo407y9w1EDiOuoHmrMEWE8X860GKvQgnEkCefO6K5E9Rmz8CSHBQ0dpdnWhC_kBUIsDdfobQSqvCdDyIpdWtiMqXh-FLT4G5ek3GQln1mNIk7ht79kyYY5tiDM3RxiydNO9qPZE7tL7mPU76Yak2yVjjKaTb5i8hPoGCPJfYJV0R2kRH_xt9Lk3tfolMtUTQ9ymCeDsiN7KHtGKXW7smtnMlRkl9_KxWVsBl6_pOiRNlsVO3b21B3TIODkC5V_InnwyyTquOQzJML5YkN_vomsX8hoJrwSzmK9-nwkrkF5GTAj5qOpOhaGqkxjP0WK4-Ja_1eTJs-v_oF9Vt1pBd2dpzlpU3z-6HjvvxGEZ6KWMa55L5vXOxBo8UlJGD7A71ovGulNRftV8Bsz3D6aEa10fOW1st4oXOZxUFvjk3bqxs4mf_si2w9RG4jPlXZK1ec-iVH_vc795AnFZVC6tjKMtya1xaAp6yKkqR5HO3ygPHS9zMS2sAadsOPzlsyFYtbpd4JD6O7uep6PWHO-bSSOo_Oc2x7RsgTqbvGDiGSa0xBmYdfUnJSmdh3C4mDB3Lx88S8GMp0Oy1jvQchmIg7wiIyetJv3QN8RZuTUjVPH-3MwdratHLOHam-e5F-xSPlYsqf25vyJrQoLZQim2A0GwrmayugF7szi7bTQIwL0MdIL-5N6scEPd3KxEemzXrpGu3sSbt1xUT61bETTkiMmXYfbCw0-92TFwU0bOUlNeugVJFBdDq4R1K6NH8TQI8Z8ck8Evn7IKpDLoIzx3ezemRmAZnFehhx3cjGjxlc7-5lv21kfRTPDDtYflQobHFN4vif5SNpk_1osySTYLtg5E2z_19z4UKzGH2wrK46M3SltIo0DmasNEz8jnqV2yVRnMLiypLTJq1NnCJXHENLuecXIAL4Xtok-zI1ZL9_WUwLfkc0OuCJA1frMgcQuQvOHAcUHKX_tuXJiNDlXKUdwPjGUWi87pV8hOIyQXEFB2xZEvWj2idq-DK4nSBwL86GulVRzn1h00LXPS3G8IyKdCY42JLIna8vytbxSam-MdUzjjnrA1TScNrv1OA2YY2XglRPAJt2tnd9loZhy7JD7y9ilArVfbj03iNfOdN82NuzsLc1exDE6kiY0WBLyPYK19mMfg2JNg=w1426-h911?auditContext=prefetch',
    'IPHONE 17 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_E_sHHwo5U2EZyjUyMpyMJc1NOh7w_46upmZgPMMed2WCCcUAmIJKrfsQFDrnGV3CZJ4fC0xdG7s8ijIeZ18HrgJ7aCC1b6adxeorZ8nXHekAaKkNEsg8aXgJeP_WrnRNYCxRv2rCd6zaRI-mLsgRs546MHSm6y26XGL3mCAjd9mIu5AUyx7w7kkIP8INOI598LFQbH-iacm2r7MKs6H6pjiU7pFaxhrxyF1CNdRDtgzjV2BU3jQMuKbxlcJsVthVAl8CGJMsVqfUTbx2_OzOZ5-nVuflVRmcJ56bsXmrVXidc9qp39bluhGw-QMOsItTcxwcu7jQG7mz9sNSDaUhaA47a_xUCA4BdKyYpkHoOJDwhoJ6V5iIB5EGhfJjc1JfRtzh3iZBfDAP50YE3YB2mh21UfO2OJ24rk_YRT9Mz8zG8qtK2LTlQooXm0cAp5OtUsFahUjLd6iscDClI0cC77YI2GIcJiEtenq-AKJ0tT7ljPRMaqq0CHKXy6uhQQzQ7EjnKuZW_NAg63v8p-miJvmbLey09e-KqoTmFOt21PsY55eo0gZWT9LE665CLQFeaSNfzG1ADfC0lA6hWBKntmPEZrmYY2KkznT-5mSR3xDe175uLl54CwBJyOPqtkDx6t8RU3_AE7YBxJzn5kAKwSOYVO9Fbm6nwmGuAFPSmP3yvVzj0nGzmeS9CQJgk44feYFlmXeK_huA1oFv3Z9Pt2_C9X3EubrA_rdFU4VyOGUyVq4jGjzJ6CwXNLvl9f2VHOmaEzyXp4sbq-xjPJhagsBBDPD0PF9ucD_DsdRSMWwn7RIrQzdowUmqqqCApUS476oIqzhlLGa0O3zwKmgeX2TiLD2kOgPL3gCb1On4fGZibRGKjDnwYFByP4P4MM1Ih6WBePqo0gfwFSSXjSBI_x8L8PouF-KulsKkuS8C1aLW3rUNl3DC_6W_4tYHiN-Rvj8MOdwy0y9UuIEmmVxLsSSvL3IfZsTozai8zJpiZfVKB2Jn-0rEpr8a2YA04EX2i-BXhXheZ3Tr1GgLWQWBmQNGk-gI68hYnj02rPGXfMkQxaZlBLCPm-auoLlqPWcK-0JcNBpAgdK4Ib7r-QFDokik6Oq4dUaJ1RQa6r0EjYtPrMLLhzrUm-O9pSCYSv76aluAa3Z2LfH1bXj_CKOQ-XGi4nLOrnjrrCKA=w1426-h911?auditContext=prefetch',
    'IPHONE 17 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_E_sHHwo5U2EZyjUyMpyMJc1NOh7w_46upmZgPMMed2WCCcUAmIJKrfsQFDrnGV3CZJ4fC0xdG7s8ijIeZ18HrgJ7aCC1b6adxeorZ8nXHekAaKkNEsg8aXgJeP_WrnRNYCxRv2rCd6zaRI-mLsgRs546MHSm6y26XGL3mCAjd9mIu5AUyx7w7kkIP8INOI598LFQbH-iacm2r7MKs6H6pjiU7pFaxhrxyF1CNdRDtgzjV2BU3jQMuKbxlcJsVthVAl8CGJMsVqfUTbx2_OzOZ5-nVuflVRmcJ56bsXmrVXidc9qp39bluhGw-QMOsItTcxwcu7jQG7mz9sNSDaUhaA47a_xUCA4BdKyYpkHoOJDwhoJ6V5iIB5EGhfJjc1JfRtzh3iZBfDAP50YE3YB2mh21UfO2OJ24rk_YRT9Mz8zG8qtK2LTlQooXm0cAp5OtUsFahUjLd6iscDClI0cC77YI2GIcJiEtenq-AKJ0tT7ljPRMaqq0CHKXy6uhQQzQ7EjnKuZW_NAg63v8p-miJvmbLey09e-KqoTmFOt21PsY55eo0gZWT9LE665CLQFeaSNfzG1ADfC0lA6hWBKntmPEZrmYY2KkznT-5mSR3xDe175uLl54CwBJyOPqtkDx6t8RU3_AE7YBxJzn5kAKwSOYVO9Fbm6nwmGuAFPSmP3yvVzj0nGzmeS9CQJgk44feYFlmXeK_huA1oFv3Z9Pt2_C9X3EubrA_rdFU4VyOGUyVq4jGjzJ6CwXNLvl9f2VHOmaEzyXp4sbq-xjPJhagsBBDPD0PF9ucD_DsdRSMWwn7RIrQzdowUmqqqCApUS476oIqzhlLGa0O3zwKmgeX2TiLD2kOgPL3gCb1On4fGZibRGKjDnwYFByP4P4MM1Ih6WBePqo0gfwFSSXjSBI_x8L8PouF-KulsKkuS8C1aLW3rUNl3DC_6W_4tYHiN-Rvj8MOdwy0y9UuIEmmVxLsSSvL3IfZsTozai8zJpiZfVKB2Jn-0rEpr8a2YA04EX2i-BXhXheZ3Tr1GgLWQWBmQNGk-gI68hYnj02rPGXfMkQxaZlBLCPm-auoLlqPWcK-0JcNBpAgdK4Ib7r-QFDokik6Oq4dUaJ1RQa6r0EjYtPrMLLhzrUm-O9pSCYSv76aluAa3Z2LfH1bXj_CKOQ-XGi4nLOrnjrrCKA=w1426-h911?auditContext=prefetch'
  };

  return cdnMap[normalized] || null;
}

/**
 * Resolve qual imagem usar como fallback (CDN > Local).
 */
function resolveFallbackImage(nomeProduto) {
  return getCDNImagePath(nomeProduto) || getProductImagePath(nomeProduto);
}

function parseGvizResponse(gvizText) {
  if (!gvizText) return [];

  const rawText = typeof gvizText === 'string' ? gvizText.trim() : '';

  const parseTable = (table) => {
    if (!table?.cols || !Array.isArray(table.rows)) return [];

    const rows = Array.isArray(table.rows) ? table.rows : [];
    const fallbackHeaders = table.cols.map((col, index) => {
      const label = (col.label || '').trim();
      const columnName = label || (col.id || `col${index + 1}`).trim();
      return columnName;
    });

    let headers = fallbackHeaders;
    let dataRows = rows;

    if (rows.length > 0) {
      const firstRowValues = (rows[0]?.c || []).map((cell, index) => {
        const value = cell?.f !== undefined && cell?.f !== null
          ? cell.f
          : (cell?.v !== undefined ? cell.v : '');
        const normalizedValue = typeof value === 'string' ? value.trim() : '';
        return normalizedValue || fallbackHeaders[index] || `col${index + 1}`;
      });

      const looksLikeHeaders = firstRowValues.some((value) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value));

      if (looksLikeHeaders) {
        headers = firstRowValues;
        dataRows = rows.slice(1);
      }
    }

    return dataRows.map((row) => {
      const cells = row?.c || [];
      const product = {};

      headers.forEach((header, index) => {
        const cell = cells[index] || {};
        const value = cell.f !== undefined && cell.f !== null
          ? cell.f
          : (cell.v !== undefined ? cell.v : '');
        product[header] = value ?? '';
      });

      return product;
    }).filter((product) => Object.values(product).some((value) => String(value).trim()));
  };

  if (rawText.startsWith('{') || rawText.startsWith('[')) {
    try {
      const parsed = JSON.parse(rawText);
      if (parsed?.table) return parseTable(parsed.table);
      if (Array.isArray(parsed)) return parsed;
    } catch (error) {
      console.warn('Não foi possível interpretar o JSON diretamente.', error);
    }
  }

  const startToken = 'google.visualization.Query.setResponse(';
  const start = rawText.indexOf(startToken);

  if (start === -1) {
    return [];
  }

  const jsonText = rawText.substring(start + startToken.length, rawText.lastIndexOf(');'));
  const response = JSON.parse(jsonText);
  return parseTable(response?.table);
}

function normalizeProducts(data) {
  const normalizedProducts = data
    .map((product) => {
      const rawDescription = product.descricao || product.obs || product.observacao || product.description || product.descricaoProduto || '';
      const fallbackDescription = rawDescription || (product[Object.keys(product).find((key) => key === 'descricao')] || '');

      const name = firstNonEmpty(
        product.aparelhoDescricao,
        product.nome_produto,
        product.nomeProduto,
        product.name,
        product.titulo,
        product[Object.keys(product).find((key) => key === 'IPHONE 14')],
        product[Object.keys(product).find((key) => /^IPHONE|SAMSUNG|XIAOMI/i.test(key))],
        product[Object.keys(product).find((key) => key === 'A' && product[key])]
      );

      const description = firstNonEmpty(
        product.descricao,
        product.descricaoProduto,
        product.observacao,
        product.description,
        fallbackDescription
      );

      const price = Number(
        firstNonEmpty(
          product.valorVenda,
          product.valorVenda2,
          product.valorVenda3,
          product.valorCusto,
          product.preco,
          product.price,
          product.K,
          product['K'],
          product['5622'],
          product['0']
        )
      ) || 0;

      const state = firstNonEmpty(
        product.estadoProdutoDescricao,
        product.estado,
        product.estadoProduto,
        product.status,
        product['SEMI NOVO'],
        product['N'],
        product['AM'],
        product['AN']
      );

      const storage = firstNonEmpty(
        product.gbDescricao,
        product.memoria,
        product.armazenamento,
        product.storage,
        product['128gb'],
        product['Z'],
        product['AA']
      );

      const category = firstNonEmpty(
        product.tipoProdutoDescricao,
        product.categoria,
        product.tipo,
        product.category,
        product['CELULAR'],
        product['Y']
      );

      const resolvedName = name || (product["aparelhoDescricao"] ? product["aparelhoDescricao"] : 'Sem nome');
      const fallbackImage = resolveFallbackImage(resolvedName);
      const image = firstNonEmpty(
        product.fotoUrl,
        product.foto,
        product.imagem,
        product.image,
        fallbackImage
      );

      const imei = firstNonEmpty(
        product.imei,
        product.IMEI,
        product.imeiNumero,
        product.numeroImei,
        product['IMEI']
      );

      const hasBlockedKeyword = /(display|bateria)/i.test(String(product.aparelhoDescricao || ''));
      //console.log(product)

      return {
        id: firstNonEmpty(product.id, product.codigo, product.sku, product.idProduto),
        name: resolvedName || 'Sem nome',
        description: description || `${state || 'Produto'} • ${storage || 'Sem informação'}`,
        price,
        state: state || 'Sem estado',
        storage: storage || 'Sem informação',
        category: category || 'Sem categoria',
        imei: imei || 'Não informado',
        image: image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        shouldHide: hasBlockedKeyword,
        distinctKey: `${String(firstNonEmpty(product.aparelhoDescricao, resolvedName)).trim().toLowerCase()}::${String(state).trim().toLowerCase()}`
      };
    })
    .filter((product) => product.name && product.name !== 'Sem nome' && !product.shouldHide);

  const seenProducts = new Set();

  const uniqueProducts = normalizedProducts.filter((product) => {
    if (!product.distinctKey || seenProducts.has(product.distinctKey)) {
      return false;
    }

    seenProducts.add(product.distinctKey);
    return true;
  });

  return uniqueProducts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

function renderProducts(products) {
  const grid = document.getElementById('products-grid');

  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <h5 class="text-muted">Nenhum produto encontrado.</h5>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(product => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card product-card shadow-sm h-100">
        <img src="${product.image}" class="product-image object-fit-contain" alt="${product.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h5 class="card-title mb-0">${product.name}</h5>
          </div>
          <div class="product-meta mb-3">
            <div>Estado: ${product.state}</div>
            <div>Armazenamento: ${product.storage}</div>
            <div>IMEI: ${product.imei || 'Não informado'}</div>
          </div>
          <div class="mt-auto">
              <button class="btn btn-buy w-100" data-product-name="${product.name}" data-product-state="${product.state}" data-product-imei="${product.imei || ''}">
              <i class="bi bi-whatsapp me-2"></i>Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.btn-buy').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-product-name') || 'produto';
      const state = button.getAttribute('data-product-state') || 'não informado';
      const imei = button.getAttribute('data-product-imei') || 'não informado';
      const message = `Olá, vim pelo site. Quero mais detalhes sobre o aparelho: ${name}, imei: ${imei}, estado: ${state}`;
      openWhatsapp(message);
    });
  });
}

function populateFilters(products) {
  const filter = document.getElementById('category-filter');
  if (!filter) return;

  const states = [
    ...new Set(
      products
        .map(product => product.state)
        .filter(state => state?.trim())
    )
  ].sort();

  filter.innerHTML = '<option value="">Estado aparelho</option>';

  states.forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    filter.appendChild(option);
  });
}

function filterProducts() {
  const searchInput = document.getElementById('search-input');
  const filter = document.getElementById('category-filter');

  if (!searchInput || !filter) return;

  const searchTerm = searchInput.value.toLowerCase().trim();
  const stateFilter = filter.value;

  const filtered = allProducts.filter(product => {
    const matchesSearch = !searchTerm || String(product.name || '').toLowerCase().includes(searchTerm);
    const matchesState = !stateFilter || product.state === stateFilter;
    return matchesSearch && matchesState;
  });

  renderProducts(filtered);
}

window.askForXiaomi = function () {
  openWhatsapp('Eu vim pelo site e quero mais detalhes sobre um Xiaomi.');
};

function debounce(fn, delay = 300) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}

async function init() {
  try {
    const response = await fetch(SHEET_URL);

    if (!response.ok) {
      throw new Error(`Falha ao carregar a planilha (${response.status}).`);
    }

    const text = await response.text();
    const data = parseGvizResponse(text);

    allProducts = normalizeProducts(data);

    populateFilters(allProducts);
    renderProducts(allProducts);

    const searchInput = document.getElementById('search-input');
    const filter = document.getElementById('category-filter');
    const searchButton = document.getElementById('search-btn-mobile');

    if (searchInput) {
      const debouncedFilter = debounce(filterProducts, 300);

      searchInput.addEventListener('input', () => {
        debouncedFilter();

        clearTimeout(searchOffcanvasTimeout);

        searchOffcanvasTimeout = setTimeout(() => {
          if (
            window.innerWidth < 992 &&
            searchInput.value.trim()
          ) {
            const offcanvas = bootstrap.Offcanvas.getInstance(
              document.getElementById('filtersOffcanvas')
            );

            offcanvas?.hide();
          }
        }, 4000);
      });
    }

    if (searchButton) {
      searchButton.addEventListener('click', () => {
        filterProducts();

        if (window.innerWidth < 992) {
          const offcanvas = bootstrap.Offcanvas.getInstance(
            document.getElementById('filtersOffcanvas')
          );

          offcanvas?.hide();
        }
      });
    }

    if (filter) {
      filter.addEventListener('change', () => {
        filterProducts();

        if (window.innerWidth < 992) {
          const offcanvas = bootstrap.Offcanvas.getInstance(
            document.getElementById('filtersOffcanvas')
          );

          offcanvas?.hide();
        }
      });
    }

    const offcanvasElement =
      document.getElementById('filtersOffcanvas');

    if (offcanvasElement) {
      offcanvasElement.addEventListener(
        'hidden.bs.offcanvas',
        () => {
          clearTimeout(searchOffcanvasTimeout);
        }
      );
    }

  } catch (error) {
    console.error('Erro ao carregar os produtos.', error);

    const grid = document.getElementById('products-grid');

    if (grid) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5 text-danger">
          Erro ao carregar os produtos. Verifique se a planilha está pública.
        </div>
      `;
    }
  }
}

function moveFilters() {
  const filters = document.getElementById('filters-content');
  const desktopContainer = document.getElementById('desktop-filters-container');
  const mobileContainer = document.getElementById('mobile-filters-container');

  if (!filters || !desktopContainer || !mobileContainer) {
    return;
  }

  filters.classList.remove('d-none');

  if (window.innerWidth < 992) {
    mobileContainer.appendChild(filters);
  } else {
    desktopContainer.appendChild(filters);
  }
}

window.addEventListener('resize', moveFilters);
window.addEventListener('DOMContentLoaded', moveFilters);

window.addEventListener('DOMContentLoaded', init);

