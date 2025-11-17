from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_verification_email(user, token):
    """Envía email de verificación de registro"""
    verification_link = f"{settings.FRONTEND_URL}/verify-email/{token.token}"
    
    subject = '🎓 Verifica tu correo - Educoin'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #f97316 0%, #ff8c1a 100%); 
                      color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; padding: 15px 30px; background: #f97316; 
                      color: white; text-decoration: none; border-radius: 8px; 
                      font-weight: bold; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>¡Bienvenido a Educoin! 🎉</h1>
            </div>
            <div class="content">
                <h2>Hola {user.first_name},</h2>
                <p>Gracias por registrarte en Educoin. Para completar tu registro, 
                   necesitamos verificar tu correo electrónico.</p>
                
                <p>Por favor, haz clic en el siguiente botón para verificar tu cuenta:</p>
                
                <div style="text-align: center;">
                    <a href="{verification_link}" class="button">
                        Verificar mi correo
                    </a>
                </div>
                
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="background: white; padding: 10px; border-radius: 5px; 
                   word-break: break-all; font-size: 12px;">
                    {verification_link}
                </p>
                
                <p><strong>Este enlace expirará en 24 horas.</strong></p>
                
                <p>Si no te registraste en Educoin, puedes ignorar este correo.</p>
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no respondas.</p>
                <p>© 2025 Educoin - Aprende. Gana. Evoluciona.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_welcome_email(user, is_google_signup=False):
    """Envía email de bienvenida después de verificación o registro con Google"""
    subject = '🎊 ¡Tu cuenta está lista! - Educoin'
    
    login_link = f"{settings.FRONTEND_URL}/login"
    dashboard_link = f"{settings.FRONTEND_URL}/dashboard"
    
    signup_method = "Google" if is_google_signup else "registro manual"
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #f97316 0%, #ff8c1a 100%); 
                      color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; padding: 15px 30px; background: #f97316; 
                      color: white; text-decoration: none; border-radius: 8px; 
                      font-weight: bold; margin: 20px 0; }}
            .feature-box {{ background: white; padding: 15px; margin: 10px 0; 
                           border-left: 4px solid #f97316; border-radius: 5px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>¡Cuenta Activada! 🎊</h1>
            </div>
            <div class="content">
                <h2>¡Hola {user.first_name}!</h2>
                <p>Tu cuenta en Educoin ha sido creada exitosamente mediante {signup_method}.</p>
                
                <h3>¿Qué puedes hacer ahora?</h3>
                
                <div class="feature-box">
                    <strong>💰 Gana Educoins</strong>
                    <p>Completa actividades y obtén recompensas por tu aprendizaje.</p>
                </div>
                
                <div class="feature-box">
                    <strong>🎯 Únete a Grupos</strong>
                    <p>Participa en clases y colabora con otros estudiantes.</p>
                </div>
                
                <div class="feature-box">
                    <strong>🏆 Participa en Subastas</strong>
                    <p>Usa tus Educoins para ganar premios exclusivos.</p>
                </div>
                
                <div style="text-align: center;">
                    <a href="{dashboard_link}" class="button">
                        Ir a mi Dashboard
                    </a>
                </div>
                
                <p style="margin-top: 30px;">
                    Si tienes alguna pregunta, no dudes en contactarnos.
                </p>
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no respondas.</p>
                <p>© 2025 Educoin - Aprende. Gana. Evoluciona.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_password_reset_email(user, reset_link):
    """Envía email para restablecer contraseña"""
    subject = '🔒 Restablece tu contraseña - Educoin'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
                      color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; padding: 15px 30px; background: #3b82f6; 
                      color: white; text-decoration: none; border-radius: 8px; 
                      font-weight: bold; margin: 20px 0; }}
            .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; 
                       padding: 15px; margin: 20px 0; border-radius: 5px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Restablecimiento de Contraseña 🔒</h1>
            </div>
            <div class="content">
                <h2>Hola {user.first_name},</h2>
                <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                
                <div style="text-align: center;">
                    <a href="{reset_link}" class="button">
                        Restablecer mi contraseña
                    </a>
                </div>
                
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="background: white; padding: 10px; border-radius: 5px; 
                   word-break: break-all; font-size: 12px;">
                    {reset_link}
                </p>
                
                <div class="warning">
                    <strong>⚠️ Importante:</strong>
                    <ul>
                        <li>Este enlace expirará en 1 hora</li>
                        <li>Si no solicitaste este cambio, ignora este correo</li>
                        <li>Tu contraseña actual seguirá siendo válida</li>
                    </ul>
                </div>
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no respondas.</p>
                <p>© 2025 Educoin - Aprende. Gana. Evoluciona.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_account_deletion_confirmation_email(user):
    """Envía confirmación de eliminación de cuenta"""
    subject = '👋 Confirmación de eliminación de cuenta - Educoin'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                      color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Cuenta Eliminada</h1>
            </div>
            <div class="content">
                <h2>Adiós {user.first_name},</h2>
                <p>Tu cuenta en Educoin ha sido eliminada exitosamente.</p>
                
                <p>Lamentamos verte partir. Todos tus datos han sido eliminados de nuestros servidores.</p>
                
                <p>Si decides volver en el futuro, siempre serás bienvenido a crear una nueva cuenta.</p>
                
                <p><strong>Gracias por haber sido parte de Educoin.</strong></p>
            </div>
            <div class="footer">
                <p>© 2025 Educoin - Aprende. Gana. Evoluciona.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )