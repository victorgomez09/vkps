package com.esmo.empaas.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;

@Component
public class CmdUtil {

    private final Logger logger = LoggerFactory.getLogger(CmdUtil.class);

    public void executeCommand(String command) {
        ProcessBuilder processBuilder = new ProcessBuilder();

        if (isWindowsOs()) {
            processBuilder.command("cmd.exe", "/c", command);
        } else {
            processBuilder.command("bash", "-c", command);
        }

        try {
            Process process = processBuilder.start();
            StringBuilder output = new StringBuilder();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitVal = process.waitFor();
            if (exitVal == 0) {
                System.out.println("Success!");
                System.out.println(output);
                System.exit(0);
            } else {
                logger.error("Error code: " + exitVal + " " + output.toString());
            }

        } catch (IOException | InterruptedException e) {
            logger.error(e.getMessage(), e);
        }
    }

    public boolean isWindowsOs() {
        return System.getProperty("os.name")
                .toLowerCase().startsWith("windows");
    }
}
