param(
    [Parameter(Mandatory)][string]$Stories,
    [Parameter(Mandatory)][string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$scriptData = Get-Content -LiteralPath $Stories -Raw -Encoding UTF8 | ConvertFrom-Json
$voice = [System.Speech.Synthesis.SpeechSynthesizer]::new()
$voice.SetOutputToNull()
$format = [System.Speech.AudioFormat.SpeechAudioFormatInfo]::new(
    44100,
    [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,
    [System.Speech.AudioFormat.AudioChannel]::Mono
)
try {
    foreach ($item in $scriptData.PSObject.Properties) {
        $target = Join-Path $OutputDirectory $item.Name
        New-Item -Path $target -ItemType Directory -Force | Out-Null
        $voice.Rate = if ($item.Name -eq 'confessor') { -1 } else { 0 }
        $sceneNumber = 0
        foreach ($scene in $item.Value.scenes) {
            $cueNumber = 0
            foreach ($line in $scene.speech) {
                $path = Join-Path $target "$sceneNumber-$cueNumber.wav"
                $voice.SetOutputToWaveFile($path, $format)
                $voice.Speak($line)
                $voice.SetOutputToNull()
                $cueNumber += 1
            }
            $sceneNumber += 1
        }
    }
    $voice.Voice.Name
} finally {
    $voice.Dispose()
}
