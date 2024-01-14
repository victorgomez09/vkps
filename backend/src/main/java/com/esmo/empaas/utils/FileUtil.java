package com.esmo.empaas.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Component
public class FileUtil {

    private final Logger logger = LoggerFactory.getLogger(FileUtil.class);

    public boolean searchFile(String projectDir, String fileName) {
        // TODO: concatenate application repository dir with project dir(applicaiton name)
        File rootDirectory = new File(projectDir);

        Optional<Path> foundFile = Optional.empty();
        try (Stream<Path> walkStream = Files.walk(rootDirectory.toPath(), 5)) {
            foundFile = walkStream.filter(p -> p.toFile().isFile())
                    .filter(p -> p.toString().endsWith(fileName))
                    .findFirst();
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }

        if(foundFile.isPresent()) {
            System.out.println(foundFile.get());
            return true;
        } else {
            System.out.println("File not found");
            return false;
        }
    }

    public void writeToFile(List<String> content, String projectDir, String fileName) {
        File file = new File(projectDir, fileName);

        try {
            Files.write(file.toPath(), content);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }
    }
}
