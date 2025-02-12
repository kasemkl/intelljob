import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/") // السماح لجميع المسارات
                        .allowedOrigins("http://localhost:5173") // السماح للنطاق الخاص بالواجهة الأمامية
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS"); // السماح بالطرق HTTP
            }
        };
    }
}