package conect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
	
	@Override //WebMvcConfigurer의 추상 메소드를 재정의
	public void addCorsMappings(CorsRegistry registry) {
		// 모든 URL에 대해 '/ws'(Websocket Endpoint) 연결 허용
		registry.addMapping("/**")
		.allowedOrigins("http://192.168.0.150:3000")
		.allowedMethods("GET", "POST", "PUT", "DELETE") //허용 메소드 범위 지정
		.allowedHeaders("*"); //모든 헤더 허용
	}
}
