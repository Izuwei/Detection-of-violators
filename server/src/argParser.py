import os
import sys
import argparse

suffix = ".mp4"

def argumentParser():
    parser = argparse.ArgumentParser(
        description="Detection and analysis of objects in video sequence."
    )
    # TODO: předělat na 'required'., zkontrolovat validní soubor, při chybjicí koncovce háže vyjímku (např. .mp4)
    parser.add_argument(
        "-i",
        "--input",
        type=str,
        default="D:\VUT\DP\Videos/downtown_short.mp4",
        required=False,
        metavar="",
        help="Path to video source.",
    )
    parser.add_argument(
        "-n",
        "--name",
        type=str,
        default="processed",
        required=False,
        metavar="",
        help="The name of the output file.",
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
        "-a",
        "--area",
        type=int,
        nargs=4,
        required=False,
        metavar="",
        help="Defines a detection area as [x, y, width, height]. (default: fullscreen)",
    )
    parser.add_argument(
        "-l",
        "--traillen",
        type=float,
        default=1.5,
        required=False,
        metavar="",
        help="Sets path length of the tracked object in seconds. (require '-t' and '-p', default: 1.5)",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=".",
        required=False,
        metavar="",
        help="Sets path for the output. (default: .)",
    )
    parser.add_argument(
        "-v",
        "--cars",
        default=False,
        required=False,
        metavar="",
        action=argparse.BooleanOptionalAction,
        help="Include cars into detected objects.",
    )
    parser.add_argument(
        "-f",
        "--frame",
        default=False,
        required=False,
        metavar="",
        action=argparse.BooleanOptionalAction,
        help="Draw a box around the detection area for its visibility. (require: '-a')",
    )
    parser.add_argument(
        "-r",
        "--recognition",
        default=False,
        required=False,
        metavar="",
        action=argparse.BooleanOptionalAction,
        help="Set to recognize people by face.",
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
        help="Set to draw paths of tracked objects. (require '-t')",
    )
    parser.add_argument(
        "-c",
        "--counter",
        default=False,
        required=False,
        metavar="",
        action=argparse.BooleanOptionalAction,
        help="Set to display counters of tracked objects. (require '-t')",
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

    parser = parser.parse_args()

    # Ošetření cesty
    if os.path.exists(parser.output) == False:
        sys.stderr.write("Specified output path does not exist.\n")
        exit(1)

    # Přidání přípony souboru
    parser.name += suffix

    # Cesta výstupního video souboru
    parser.output = os.path.join(parser.output, parser.name)

    # Převod formátu detekční oblasti z [x,y,w,h] na [x1,y1,x2,y2]
    if parser.area != None:
        parser.area[0] = abs(parser.area[0])
        parser.area[1] = abs(parser.area[1])
        parser.area[2] = abs(parser.area[2])
        parser.area[3] = abs(parser.area[3])
        parser.area[2] = parser.area[0] + parser.area[2] # x2 = x1 + width
        parser.area[3] = parser.area[1] + parser.area[3] # y2 = y1 + height

    return parser
