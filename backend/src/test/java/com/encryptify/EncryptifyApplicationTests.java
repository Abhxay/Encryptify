package com.encryptify;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest(classes = com.encryptify.EncryptifyApplication.class)

public class EncryptifyApplicationTests {
	@Test
	void contextLoads() {
	}
}
