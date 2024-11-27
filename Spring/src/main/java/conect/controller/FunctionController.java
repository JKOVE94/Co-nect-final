package conect.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/function")
public class FunctionController {

    @GetMapping("/schedule")
    public Map<String, Object> getDataAll(String usernum){
    	return Map.of();
    }
}
