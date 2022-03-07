import os
import sys
import argparse

videoFilename = "processed.avi"


def argumentParser():
    parser = argparse.ArgumentParser(
        description="Detection and analysis of objects in video sequence."
    )
    # TODO: předělat na 'required'., zkontrolovat validní soubor, při chybjicí koncovce háže vyjímku (např. .mp4)
    parser.add_argument(
        "-i",
        "--input",
        type=str,
        default="D:\VUT\DP\Videos/downtown_la.mp4",
        required=False,
        metavar="",
        help="Path to video source.",
    )
    # TODO: dodělat tiny?
    parser.add_argument(
        "-m",
        "--model",
        type=str,
        default="yolo320",
        choices=["yolo320", "yolo608"],
        required=False,
        metavar="",
        help="Defines a model for object detection. (default: yolo320)",
    )
    parser.add_argument(
        "-t",
        "--tracking",
        default=False,
        required=False,
        metavar="",
        action=argparse.BooleanOptionalAction,
        help="Sets tracking of objects.",
    )
    parser.add_argument(
        "-p",
        "--paths",
        default=False,
        required=False,
        metavar="",
        action=argparse.BooleanOptionalAction,
        help="Set to draw paths of tracked objects (require '-t').",
    )
    parser.add_argument(
        "-l",
        "--traillen",
        type=float,
        default=1.5,
        required=False,
        metavar="",
        help="Sets path length of the tracked object in seconds (require '-t' and '-p'). (default: 1.5)",
    )
    parser.add_argument(
        "-c",
        "--counter",
        default=False,
        required=False,
        metavar="",
        action=argparse.BooleanOptionalAction,
        help="Set to display counters of tracked objects (require '-t').",
    )
    parser.add_argument(
        "-s",
        "--timestamp",
        default=False,
        required=False,
        metavar="",
        action=argparse.BooleanOptionalAction,
        help="Set to display current timestamp.",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=".",
        required=False,
        metavar="",
        help="Sets path for the output. (default: .)",
    )
    # TODO: přidat frame

    parser = parser.parse_args()

    # Ošetření cesty
    if os.path.exists(parser.output) == False:
        sys.stderr.write("Specified output path does not exist.\n")
        exit(1)

    # Cesta výstupního video souboru
    parser.output = os.path.join(parser.output, videoFilename)

    return parser
