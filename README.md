SlideASeal
==========

A Slide a Lama clone


#Aufgaben

##Server
* Punktermittlung und Übertragung zum Client
* Bereinung vom Spielfeld. (Steine müssen herunterfallen)
* State für den der gerade am Zug ist zum GameState hinzufügen

##Client
* Hintergrund (Schiff + Eisberg)


* Spielfeld (Kacheln)
** Kacheln
** Verschieben von Kacheln
** Preview der aktuellen Kachel am Rand
** Punkte erzielen (Annimation)

* Vordergund (Robben)
** auf andere Seite robben
** Zwischenanimation (beim Warten)


* HUD (Spielstatus + Rad)
** Updates vom Spielfeld bekommen
** Rad drehen
** Neuer Spielstein



#Spiellogik

## GameState
* Array mit dem Spielfeld
* aktueller Spieler, der dran is
** Seinen neuen Stein
* aktuelle Punktzahl aller Spieler


## Game

* Berechnung neuer Stein
* Berechnung Punktgewinn
* Berechnung wann Robben rüberrobbt
* Berechnung des neuen GameState
** Wenn Punktgewinn, dann Berechnung enuer
* Spielende abfrage

## Kachel
* Position x,y
* id
* Typ


## Player
* Name