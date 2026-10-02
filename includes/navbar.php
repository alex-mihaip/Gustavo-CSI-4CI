<?php
// includes/navbar.php — Header e navigazione centralizzata
if (!isset($active_page)) {
    $current_file = basename($_SERVER['PHP_SELF'] ?? 'index.php');
    $active_page = str_replace(['.php', '.html'], '', $current_file);
    if ($active_page === '' || $active_page === 'index') {
        $active_page = 'home';
    }
}
$link_ext = '.html';
?>
<!-- NAVBAR UFFICIALE GUSTAVO -->
<header>
    <nav class="navbar">
      <a href="index<?php echo $link_ext; ?>" class="logo-link">
        <span class="nav-logo-box skeleton">
            <img src="assets/img/gustavo_icon.png" alt="Logo GustAvo" class="nav-logo-icon">
        </span>
        <span class="logo-testo">
        <span class="logo-nome">GustAvo</span>
        <span class="logo-motto">Il chatbot che ti orienta a scuola</span>
    </span>
</a>
        <ul class="nav-links">
            <li><a href="index<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'home' ? 'active' : ''); ?>">Home</a></li>
            <li><a href="progetto<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'progetto' ? 'active' : ''); ?>">Progetto</a></li>
            <li><a href="team<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'team' ? 'active' : ''); ?>">Team</a></li>
            <li><a href="documentazione<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'documentazione' ? 'active' : ''); ?>">Documentazione</a></li>
            <li><a href="chatbot<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'chatbot' ? 'active' : ''); ?>">Chatbot</a></li>
            <li><a href="galleria<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'galleria' ? 'active' : ''); ?>">Galleria</a></li>
        </ul>

        <button class="hamburger" id="hamburger" aria-label="Menu di navigazione" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
    </nav>

    <!-- MENU MOBILE TOUCH-FRIENDLY -->
    <nav class="nav-mobile" id="navMobile" aria-hidden="true">
        <a href="index<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'home' ? 'active' : ''); ?>">Home</a>
        <a href="progetto<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'progetto' ? 'active' : ''); ?>">Progetto</a>
        <a href="team<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'team' ? 'active' : ''); ?>">Team</a>
        <a href="documentazione<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'documentazione' ? 'active' : ''); ?>">Documentazione</a>
        <a href="chatbot<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'chatbot' ? 'active' : ''); ?>">Chatbot</a>
        <a href="galleria<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'galleria' ? 'active' : ''); ?>">Galleria</a>
    </nav>
</header>