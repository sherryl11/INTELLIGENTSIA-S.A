<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guestbook - INTELLIGENTSIA SA</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <img src="images/logo.jpg" alt="INTELLIGENTSIA SA Logo">
                <span>INTELLIGENTSIA SA</span>
            </div>
            <ul class="nav-menu">
                <li><a href="index.html">Home</a></li>
                <li><a href="index.html#about">About Us</a></li>
                <li><a href="index.html#departments">Departments</a></li>
                <li><a href="index.html#services">Services</a></li>
                <li><a href="index.html#products">Products</a></li>
                <li><a href="index.html#team">Team</a></li>
                <li><a href="contact.php">Contact</a></li>
                <li><a href="guestbook.php">Guestbook</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Guestbook Section -->
    <section class="guestbook" style="padding-top: 150px; background: #f8f9fa; padding: 100px 0;">
        <div class="container">
            <h2>Guestbook</h2>
            <div class="guestbook-content">
                <div class="guestbook-form">
                    <h3>Leave a Message</h3>
                    <?php
                    if ($_SERVER["REQUEST_METHOD"] == "POST") {
                        $name = htmlspecialchars($_POST['name']);
                        $message = htmlspecialchars($_POST['message']);

                        if (!empty($name) && !empty($message)) {
                            $data = "Name: $name\nMessage: $message\nDate: " . date("Y-m-d H:i:s") . "\n---\n";
                            file_put_contents('guestbook.txt', $data, FILE_APPEND);
                            echo "<p style='color: green;'>Thank you for your message!</p>";
                        } else {
                            echo "<p style='color: red;'>Please fill in all required fields.</p>";
                        }
                    }
                    ?>
                    <form action="guestbook.php" method="post">
                        <div class="form-group">
                            <input type="text" name="name" placeholder="Your Name" required>
                        </div>
                        <div class="form-group">
                            <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="submit-btn">Submit</button>
                    </form>
                </div>
                <div class="guestbook-messages">
                    <h3>Previous Messages</h3>
                    <div class="messages-list">
                        <?php
                        if (file_exists('guestbook.txt')) {
                            $content = file_get_contents('guestbook.txt');
                            $entries = explode("---\n", $content);
                            foreach (array_reverse($entries) as $entry) {
                                if (!empty(trim($entry))) {
                                    $lines = explode("\n", trim($entry));
                                    echo "<div class='message-item'>";
                                    foreach ($lines as $line) {
                                        if (strpos($line, 'Name:') === 0) {
                                            echo "<strong>" . htmlspecialchars(substr($line, 6)) . "</strong><br>";
                                        } elseif (strpos($line, 'Message:') === 0) {
                                            echo "<p>" . htmlspecialchars(substr($line, 9)) . "</p>";
                                        } elseif (strpos($line, 'Date:') === 0) {
                                            echo "<small>" . htmlspecialchars(substr($line, 6)) . "</small>";
                                        }
                                    }
                                    echo "</div>";
                                }
                            }
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>INTELLIGENTSIA SA</h3>
                    <p>Leading digital technology integration in Central Africa since 2002.</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-linkedin"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-facebook"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="index.html#about">About Us</a></li>
                        <li><a href="index.html#services">Services</a></li>
                        <li><a href="index.html#products">Products</a></li>
                        <li><a href="index.html#team">Team</a></li>
                        <li><a href="contact.php">Contact</a></li>
                        <li><a href="guestbook.php">Guestbook</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact</h4>
                    <p>Avenue Charles de Gaulle<br>BP 11 543 Yaoundé<br>Cameroon</p>
                    <p>Phone: (+237) 243 548 814</p>
                    <p>Email: info@intelligentsia.biz</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 INTELLIGENTSIA SA. All rights reserved. </p>
            </div>
        </div>
    </footer>
    <script src="script.js"></script>
</body>
</html>
