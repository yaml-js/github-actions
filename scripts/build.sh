#!/bin/bash

projects=(
    "github-actions-src:yarn install && yarn build:true:lib"
    # Add more projects as needed, format: "directory:build_command:commit:output_folder"
)

for config in "${projects[@]}"; do
    # Split the config string into an array
    IFS=':' read -r -a config_array <<< "$config"

    # Extract the project configuration
    project_dir="${config_array[0]}"
    build_commands="${config_array[1]}"
    commit_changes="${config_array[2]}"
    output_folder="${config_array[3]}"

    echo "Building project: $project_dir"

    # Navigate to the project directory
    cd "$project_dir" || { echo "Failed to navigate to $project_dir"; exit 1; }

    # Run build commands if they are provided
    if [ -n "$build_commands" ]; then
        echo "Running build commands for $project_dir"
        IFS='&&' read -r -a commands <<< "$build_commands"
        for cmd in "${commands[@]}"; do
            echo "Executing: $cmd"
            if ! eval "$cmd"; then
                echo "Command failed: $cmd for $project_dir"
                exit 1
            fi
        done

        # Check if the output directory exists
        if [ -d "$output_folder" ]; then
            echo "Output folder found: $output_folder"

            if [ "$commit_changes" = true ]; then
                echo "Committing changes in the $output_folder folder"

                # Add all new and updated files in the output directory
                git add "$output_folder/"

                # Commit the changes
                git commit -m "chore: update project build artifacts"
            else
                echo "Commit is disabled for $project_dir, skipping commit."
            fi
        else
            echo "No $output_folder folder found in $project_dir, skipping commit."
        fi
    else
        echo "Build failed for $project_dir"
        exit 1
    fi

    # Navigate back to the root directory
    cd - > /dev/null || exit 1
done

echo "All projects processed."
