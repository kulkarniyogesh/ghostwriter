"""
Language detector — identifies legacy languages from file extensions and content.
"""

import re
from typing import Optional

EXTENSION_MAP = {
    ".cbl": "COBOL",
    ".cob": "COBOL",
    ".cpy": "COBOL",
    ".pas": "Pascal",
    ".pp": "Pascal",
    ".vb": "VB6",
    ".bas": "VB6",
    ".frm": "VB6",
    ".cls": "VB6",
    ".f": "Fortran",
    ".f90": "Fortran",
    ".f95": "Fortran",
    ".for": "Fortran",
    ".pl": "Perl",
    ".cgi": "Perl",
    ".as": "ActionScript",
    ".asp": "ClassicASP",
    ".php": "PHP",
}

ERA_MARKERS = {
    "COBOL": {
        "patterns": [r"IDENTIFICATION DIVISION", r"PROGRAM-ID", r"PROCEDURE DIVISION"],
        "year": 1985,
    },
    "Pascal": {
        "patterns": [r"\bprogram\b", r"\bbegin\b", r"\bend\.", r"\bprocedure\b"],
        "year": 1992,
    },
    "VB6": {
        "patterns": [r"Private Sub", r"Public Function", r"Dim .+ As", r"MsgBox"],
        "year": 1998,
    },
    "Fortran": {
        "patterns": [r"PROGRAM ", r"SUBROUTINE ", r"REAL\*", r"INTEGER\*"],
        "year": 1980,
    },
    "Perl": {
        "patterns": [r"#!/usr/bin/perl", r"\$ENV{", r"print \"Content-type"],
        "year": 1995,
    },
    "ActionScript": {
        "patterns": [r"import flash\.", r"MovieClip", r"onClipEvent"],
        "year": 2003,
    },
    "ClassicASP": {
        "patterns": [r"<%", r"Response\.Write", r"Request\.Form"],
        "year": 1998,
    },
    "PHP": {
        "patterns": [r"<\?php", r"mysql_connect", r"ereg\("],
        "year": 2000,
    },
}


def detect_language(path: str, content: str) -> dict:
    """
    Detect legacy language from file path and content.
    Returns dict with language, estimated_year, confidence.
    """
    import os
    ext = os.path.splitext(path)[1].lower()
    language = EXTENSION_MAP.get(ext, "Unknown")

    # Confirm via content patterns
    if language != "Unknown" and language in ERA_MARKERS:
        marker = ERA_MARKERS[language]
        matches = sum(
            1 for p in marker["patterns"]
            if re.search(p, content, re.IGNORECASE)
        )
        confidence = min(100, 60 + (matches * 13))
        estimated_year = marker["year"]
    else:
        confidence = 30
        estimated_year = None

    return {
        "language": language,
        "estimated_year": estimated_year,
        "confidence": confidence,
    }


def is_legacy(language: str) -> bool:
    return language in ERA_MARKERS


def get_modern_extension(target_language: str) -> str:
    return {
        "python": ".py",
        "nodejs": ".js",
        "go": ".go",
    }.get(target_language, ".py")
