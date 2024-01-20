package com.esmo.empaas.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class DockerUtil {

    private final FileUtil fileUtil;

    public DockerUtil(FileUtil fileUtil) {
        this.fileUtil = fileUtil;
    }

    public void createNodeJsDockerFile(String baseImage, String workdir, int port, String installCommand, String buildCommand, String startCommand, String baseDirectory, Map<String, String> envs) {
//        const Dockerfile: Array<string> = [];
//  const isPnpm = checkPnpm(installCommand, buildCommand, startCommand);
//
//        Dockerfile.push(`FROM ${baseImage}`);
//        Dockerfile.push('WORKDIR /app');
//        if (envs.length > 0) {
//            envs.forEach(({ key, value }) => {
//                    Dockerfile.push(`ARG ${key}=${value}`);
//    });
//        }
//        if (isPnpm) {
//            Dockerfile.push(
//                    'RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm@7',
//                    );
//        }
//        Dockerfile.push(`COPY .${baseDirectory || ''} ./`);
//        Dockerfile.push(`RUN ${installCommand}`);
//        if (buildCommand) {
//            Dockerfile.push(`RUN ${buildCommand}`);
//        }
//        Dockerfile.push(`EXPOSE ${port}`);
//        Dockerfile.push('RUN rm -fr .git');
//        Dockerfile.push(`CMD ${startCommand}`);
//        writeFileSync(`${workdir}/Dockerfile`, Dockerfile.join('\n'));
        List<String> dockerFile = new ArrayList<>();
        dockerFile.add("FROM " + baseImage);
        dockerFile.add("WORKDIR /app");

        if (!envs.isEmpty()) {
            envs.forEach((key, value) -> {
                dockerFile.add("ARG " + key + "=" + value);
            });
        }

        dockerFile.add("COPY . " + baseDirectory);
        dockerFile.add("RUN " + installCommand);
        if (buildCommand != null) {
            dockerFile.add("RUN " + buildCommand);
        }
        dockerFile.add("EXPOSE " + port);
        dockerFile.add("RUN rm -fr .git");
        dockerFile.add("CMD " + startCommand);
        fileUtil.writeToFile(dockerFile, workdir, "Dockerfile");
    }
}
