<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="bg-Bleu p-6 text-white font-agrandir mt-20 md:mt-0 lg:mt-0">
    <div class="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto items-center lg:items-start">
      
      <section class="w-full lg:w-1/4 flex flex-col gap-4 items-center text-center lg:items-start lg:text-left">
        <div class="flex items-center gap-3">
          <img src="../assets/Img/helpMMi.png" alt="Help MMi Logo" class="w-16 h-auto" />
          <h3 class="text-3xl font-permanent-marker">HELPMMI</h3>
        </div>
        
        <address class="not-italic text-base leading-snug">
          4 pl. Lucien Tharradin<br />
          +33 7.00.00.00.00
        </address>

        <div class="flex gap-4 mt-2 justify-center lg:justify-start">
          <a href="#" class="hover:opacity-80 transition">
            <img class="w-8 h-8" src="../assets/Icones/InstagramLogo.png" alt="Instagram" />
          </a>
          <a href="#" class="hover:opacity-80 transition">
            <img class="w-8 h-8" src="../assets/Icones/FacebookLogo.png" alt="Facebook" />
          </a>
          <a href="#" class="hover:opacity-80 transition">
            <img class="w-8 h-8" src="../assets/Icones/TiktokLogo.png" alt="TikTok" />
          </a>
        </div>
      </section>

      <section class="w-full lg:w-3/4 flex flex-col">
        <h3 class="text-xl font-permanent-marker mb-6 text-center lg:text-left">CONTACTS D'URGENCES</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs items-start text-center lg:text-left">
          
          <div class="space-y-6">
            <div>
              <h4 class="font-bold italic text-sm mb-1 font-agrandir-wide">Département MMI</h4>
              <p class="font-bold">Chef du département <span class="font-normal block sm:inline">(Pascal Chatonnay)</span></p>
              <p>Tél. +33 (0)3 81 99 47 34</p>
              
              <p class="font-bold mt-2">Assistante de département <span class="font-normal block sm:inline">(Elodie Chartogne)</span></p>
              <p>Tél. +33 (0)3 81 99 47 34</p>
            </div>

            <div>
              <h4 class="font-bold italic text-sm mb-1 font-agrandir-wide">Assistante sociale</h4>
              <p class="font-bold">CROUS</p>
              <p>Tél. +33 (0)9 72 59 65 65</p>
              <p class="font-bold mt-1">Service social de la mairie</p>
              <p>Tél. +33 (0)3 81 99 23 00</p>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <h4 class="font-bold italic text-sm mb-1 font-agrandir-wide">Hébergement d'urgence</h4>
              <p class="font-bold">Pour personnes sans domicile</p>
              <p>Le numéro national 115</p>
            </div>

            <div>
              <h4 class="font-bold italic text-sm mb-1 font-agrandir-wide">Numéros nationaux essentiels</h4>
              <p class="font-bold">Urgences (pompiers / SAMU / police)</p>
              <ul class="leading-relaxed list-none lg:list-disc lg:pl-4">
                <li>112 (numéro d'urgence européen)</li>
                <li>15 (SAMU)</li>
                <li>17 (police)</li>
                <li>18 (pompiers)</li>
              </ul>
            </div>
          </div>

          <div class="space-y-4"> 
             <div>
                <p class="font-bold">Numéro national de prévention du suicide</p>
                <p class="text-lg font-bold">3114</p>
             </div>
             <div>
                <p class="font-bold">Violences faites aux femmes</p>
                <p class="text-lg font-bold">3919</p>
             </div>
             <div>
                <p class="font-bold">Harcèlement / cyberharcèlement scolaire</p>
                <p class="text-lg font-bold">3018</p>
             </div>
             <div>
                <p class="font-bold">Difficultés financières (étudiant)</p>
                <p>0 806 000 278</p>
             </div>
          </div>

        </div>
      </section>
    </div>

    <div class="mt-12 pt-4 text-center text-sm border-t border-white/20 lg:border-none">
      <p class="opacity-90">
        Conditions d'utilisations &nbsp;|&nbsp; Politique de confidentialité
      </p>
    </div>
  </footer>
</template>