<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form - INTELLIGENTSIA SA</title>
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

    <!-- Contact Section -->
    <section id="contact" class="contact" style="padding-top: 150px;">
        <div class="container">
            <h2>Contact Us</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <h3>Get In Touch</h3>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <h4>Address</h4>
                            <p>Avenue Charles de Gaulle – BP 11 543<br>Yaoundé – Cameroon</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <h4>Phone</h4>
                            <p>(+237) 243 548 814</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <h4>Email</h4>
                            <p>info@intelligentsia.biz</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-building"></i>
                        <div>
                            <h4>Registration</h4>
                            <p>Commercial Register: YAO01/04/879<br>Taxpayer No: M010200014100S</p>
                        </div>
                    </div>
                </div>
                <div class="contact-form">
                    <h3>Send us a Message</h3>
                    <?php
                    if ($_SERVER["REQUEST_METHOD"] == "POST") {
                        $name = htmlspecialchars($_POST['name']);
                        $email = htmlspecialchars($_POST['email']);
                        $subject = htmlspecialchars($_POST['subject']);
                        $message = htmlspecialchars($_POST['message']);

                        if (!empty($name) && !empty($email) && !empty($message)) {
                            $data = "Name: $name\nEmail: $email\nSubject: $subject\nMessage: $message\nDate: " . date("Y-m-d H:i:s") . "\n---\n";
                            file_put_contents('messages.txt', $data, FILE_APPEND);
                            echo "<p style='color: green;'>Thank you for your message! We will get back to you soon.</p>";
                        } else {
                            echo "<p style='color: red;'>Please fill in all required fields.</p>";
                        }
                    }
                    ?>
                    <form action="contact.php" method="post">
                        <div class="form-group">
                            <input type="text" name="name" placeholder="Your Name" required>
                        </div>
                        <div class="form-group">
                            <input type="email" name="email" placeholder="Your Email" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="subject" placeholder="Subject">
                        </div>
                        <div class="form-group">
                            <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="submit-btn">Send Message</button>
                    </form>
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
