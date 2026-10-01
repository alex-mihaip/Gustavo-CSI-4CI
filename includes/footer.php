<?php
// includes/footer.php — Footer istituzionale centralizzato
?>
<footer class="footer">
    <div class="container footer-container">
        
        <!-- LOGHI UFFICIALI: AVO, AVOPROGETTI, GUSTAVO -->
        <div class="footer-logos">
            <a href="https://www.itisavogadro.it" target="_blank" rel="noopener noreferrer" class="footer-logo-link" title="Istituto Tecnico Amedeo Avogadro — Torino">
                <img src="assets/img/logo_avogadro.png" alt="Logo IIS Avogadro" class="footer-logo-avo">
            </a>
            
            <a href="https://avoprogetti.it" target="_blank" rel="noopener noreferrer" class="footer-logo-link" title="Piattaforma AvoProgetti">
                <img src="assets/img/logo_avoprogetti.jpeg" alt="Logo AvoProgetti" class="footer-logo-avoprogetti">
            </a>

            <a href="index<?php echo (isset($link_ext) ? $link_ext : '.html'); ?>" class="footer-logo-link" title="GustAvo Chatbot">
                <img src="assets/img/gustavo_icon.png" alt="Logo GustAvo" class="footer-logo-gustavo">
            </a>
        </div>

        <div class="footer-info">
            <p class="footer-credits">
                 Progetto GustAvo <strong>5CI</strong> - <strong>IIS Amedeo Avogadro</strong>, Torino - <strong>in collaborazione con CSI Piemonte</strong>
            </p>
        </div>

    </div>
</footer>
